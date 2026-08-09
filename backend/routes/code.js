import express from 'express';
import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import Problem from '../models/Problem.js';
import Submission from '../models/Submission.js';
import { authenticate } from './auth.js';

const router = express.Router();

router.get('/problems', async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (error) {
    res.status(500).json({ detail: 'Server error' });
  }
});

router.get('/problems/:problem_id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.problem_id);
    if (!problem) {
      return res.status(404).json({ detail: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ detail: 'Server error' });
  }
});

const executeCode = async (code, language, inputStr) => {
  return new Promise(async (resolve) => {
    const runId = crypto.randomBytes(16).toString('hex');
    const tempDir = os.tmpdir();
    
    let sourcePath, compileCmd, compileArgs, execCmd, execArgs;

    try {
      if (language === 'python') {
        sourcePath = path.join(tempDir, `script_${runId}.py`);
        await fs.writeFile(sourcePath, code);
        execCmd = 'python';
        execArgs = [sourcePath];
      } else if (language === 'c') {
        sourcePath = path.join(tempDir, `main_${runId}.c`);
        const outPath = path.join(tempDir, `main_${runId}.exe`);
        await fs.writeFile(sourcePath, code);
        compileCmd = 'gcc';
        compileArgs = [sourcePath, '-o', outPath];
        execCmd = outPath;
        execArgs = [];
      } else if (language === 'cpp') {
        sourcePath = path.join(tempDir, `main_${runId}.cpp`);
        const outPath = path.join(tempDir, `main_${runId}.exe`);
        await fs.writeFile(sourcePath, code);
        compileCmd = 'g++';
        compileArgs = [sourcePath, '-o', outPath];
        execCmd = outPath;
        execArgs = [];
      } else if (language === 'java') {
        const javaDir = path.join(tempDir, `java_${runId}`);
        await fs.mkdir(javaDir, { recursive: true });
        sourcePath = path.join(javaDir, 'Main.java');
        await fs.writeFile(sourcePath, code);
        compileCmd = 'javac';
        compileArgs = [sourcePath];
        execCmd = 'java';
        execArgs = ['-cp', javaDir, 'Main'];
      } else {
        return resolve({ error: 'Unsupported language', stderr: 'Language not supported' });
      }

      // Compile step for C, C++, Java
      if (compileCmd) {
        try {
          await new Promise((compResolve, compReject) => {
            const compProcess = spawn(compileCmd, compileArgs);
            let compStderr = '';
            
            compProcess.stderr.on('data', data => compStderr += data.toString());
            
            const timeoutId = setTimeout(() => {
              compProcess.kill('SIGTERM');
              compReject(new Error('Compilation Time Limit Exceeded'));
            }, 5000);

            compProcess.on('close', code => {
              clearTimeout(timeoutId);
              if (code !== 0) {
                compReject(new Error(`Compilation Error:\n${compStderr}`));
              } else {
                compResolve();
              }
            });
            
            compProcess.on('error', err => compReject(err));
          });
        } catch (compErr) {
          // Cleanup source file on compile error
          fs.unlink(sourcePath).catch(() => {});
          if (language === 'java') fs.rm(path.dirname(sourcePath), { recursive: true, force: true }).catch(() => {});
          return resolve({ error: 'Compilation Error', stderr: compErr.message });
        }
      }

      // Execute step
      const execProcess = spawn(execCmd, execArgs);
      let stdout = '';
      let stderr = '';

      const timeoutId = setTimeout(() => {
        execProcess.kill('SIGTERM');
        resolve({ error: 'Time Limit Exceeded', stdout, stderr });
      }, 2000);

      execProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      execProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      if (inputStr) {
        execProcess.stdin.write(inputStr);
      }
      execProcess.stdin.end();

      execProcess.on('close', (code) => {
        clearTimeout(timeoutId);
        
        // Cleanup
        if (language === 'java') {
          fs.rm(path.dirname(sourcePath), { recursive: true, force: true }).catch(() => {});
        } else {
          fs.unlink(sourcePath).catch(() => {});
          if (compileCmd) fs.unlink(execCmd).catch(() => {});
        }
        
        if (code !== 0) {
          resolve({ error: 'Runtime Error', stdout, stderr });
        } else {
          resolve({ success: true, stdout, stderr });
        }
      });
      
      execProcess.on('error', err => {
         resolve({ error: 'Execution Error', stderr: err.message });
      });

    } catch (e) {
      resolve({ error: 'System Error', stderr: e.message });
    }
  });
};

const calculateSimilarityPercentage = (s1, s2) => {
  if (s1 === s2) return 100;
  if (!s1 || !s2) return 0;
  const len1 = s1.length;
  const len2 = s2.length;
  const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(null));

  for (let i = 0; i <= len1; i++) matrix[0][i] = i;
  for (let j = 0; j <= len2; j++) matrix[j][0] = j;

  for (let j = 1; j <= len2; j++) {
    for (let i = 1; i <= len1; i++) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  const distance = matrix[len2][len1];
  const maxLen = Math.max(len1, len2);
  return Math.max(0, Math.round((1 - distance / maxLen) * 100));
};

router.post('/submit', authenticate, async (req, res) => {
  const { problem_id, code, language = 'python', run_only = false } = req.body;
  try {
    const problem = await Problem.findById(problem_id);
    if (!problem) {
      return res.status(404).json({ detail: 'Problem not found' });
    }

    const supportedLangs = ['python', 'c', 'cpp', 'java'];
    if (!supportedLangs.includes(language)) {
      return res.json({ status: 'Error', message: 'Language not supported' });
    }

    if (!code || code.trim() === '') {
      return res.json({ status: 'Error', message: 'Empty code submitted' });
    }

    let test_cases = [];
    try {
      test_cases = JSON.parse(problem.test_cases);
    } catch (e) {
      return res.json({ status: 'Error', message: 'Invalid test cases format' });
    }

    let passed = 0;
    let totalSimilarity = 0;
    const total = test_cases.length;
    let results = [];
    let overallErrorStatus = null;

    for (let i = 0; i < test_cases.length; i++) {
      const tc = test_cases[i];
      const inputStr = tc.input || '';
      const expectedOut = tc.expected ? String(tc.expected).trim() : '';

      // To execute, we need to inject a wrapper if the code is just a function.
      // But for generic coding, we assume they read from stdin and write to stdout.
      // If we want to support LeetCode style (Class/Function), we would need a sophisticated wrapper.
      // For now, we will just pass input via stdin and check stdout.
      
      const execResult = await executeCode(code, language, inputStr);
      
      let tcResult = {
        test_case: i + 1,
        input: inputStr,
        expected: expectedOut,
        actual: execResult.stdout ? execResult.stdout.trim() : '',
        stderr: execResult.stderr,
        passed: false,
        similarity: 0,
        error: execResult.error
      };

      if (execResult.success) {
        const sim = calculateSimilarityPercentage(tcResult.actual, expectedOut);
        tcResult.similarity = sim;
        totalSimilarity += sim;

        if (sim === 100) {
          tcResult.passed = true;
          passed++;
        } else if (sim > 0) {
          tcResult.error = 'Partially Correct';
        } else {
          tcResult.error = 'Wrong Answer';
        }
      } else {
        if (!overallErrorStatus) overallErrorStatus = execResult.error;
      }

      results.push(tcResult);
      
      // If doing a real submission, we might break early on failure, 
      // but let's run all for detailed feedback.
    }

    const score = total > 0 ? Math.round(totalSimilarity / total) : 0;
    
    let overallStatus = 'Accepted';
    if (overallErrorStatus) {
      overallStatus = overallErrorStatus;
    } else if (score === 100 && passed === total) {
      overallStatus = 'Accepted';
    } else if (score > 0) {
      overallStatus = 'Partially Accepted';
    } else {
      overallStatus = 'Wrong Answer';
    }

    // Only save submission if it's not a "run_only" request
    if (!run_only) {
      await Submission.create({
        user_id: req.user._id,
        problem_id: problem._id,
        code,
        language,
        status: overallStatus,
        score,
      });
    }

    // Streak Logic
    let newStreak = req.user.streak || 0;
    if (!run_only && (overallStatus === 'Accepted' || overallStatus === 'Partially Accepted')) {
      const now = new Date();
      const lastSolved = req.user.last_solved_date;
      
      let isDifferentDay = true;
      let isNextDay = false;

      if (lastSolved) {
        const lastDate = new Date(lastSolved.getFullYear(), lastSolved.getMonth(), lastSolved.getDate());
        const currDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const diffTime = Math.abs(currDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays === 0) {
          isDifferentDay = false;
        } else if (diffDays === 1) {
          isNextDay = true;
        }
      }

      // Allow streak to increment for testing purposes if it's the first time or next day
      if (isDifferentDay || newStreak === 0) {
        if (isNextDay || !lastSolved || newStreak === 0) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
        req.user.streak = newStreak;
        req.user.last_solved_date = now;
        await req.user.constructor.updateOne(
          { _id: req.user._id },
          { $set: { streak: newStreak, last_solved_date: now } }
        );
      }
    }

    return res.json({
      status: overallStatus,
      passed,
      total,
      score,
      results,
      streak: newStreak
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: error.message, stack: error.stack });
  }
});

// Endpoint to fetch submissions for a specific problem for the current user
router.get('/submissions/:problem_id', authenticate, async (req, res) => {
  try {
    const submissions = await Submission.find({ 
      user_id: req.user._id, 
      problem_id: req.params.problem_id 
    }).sort({ created_at: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ detail: 'Server error' });
  }
});

// Get global recent submissions
router.get('/recent-submissions', async (req, res) => {
  try {
    const submissions = await Submission.find({ status: { $in: ['Accepted', 'Partially Accepted'] } })
      .sort({ created_at: -1 })
      .limit(10)
      .populate('problem_id', 'title difficulty');
      
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user progress (solved problems) for the current user
router.get('/my-progress', authenticate, async (req, res) => {
  try {
    const submissions = await Submission.find({ 
      user_id: req.user._id, 
      status: { $in: ['Accepted', 'Partially Accepted'] } 
    }, 'problem_id score');
    
    const solvedMap = {};
    submissions.forEach(s => {
      const pid = s.problem_id.toString();
      if (solvedMap[pid] === undefined || s.score > solvedMap[pid]) {
        solvedMap[pid] = s.score !== undefined ? s.score : 100; // fallback to 100 for old submissions
      }
    });

    res.json({ 
      solved: solvedMap,
      favorites: req.user.favorites || []
    });
  } catch (error) {
    res.status(500).json({ detail: 'Server error' });
  }
});

// Toggle favorite problem
router.post('/favorite/:problem_id', authenticate, async (req, res) => {
  try {
    const problemId = req.params.problem_id;
    let favorites = req.user.favorites || [];
    
    // Check if it's already a favorite
    const index = favorites.findIndex(id => id.toString() === problemId);
    let isFavorite = false;
    
    if (index > -1) {
      // Remove it
      favorites.splice(index, 1);
    } else {
      // Add it
      favorites.push(problemId);
      isFavorite = true;
    }
    
    req.user.favorites = favorites;
    await req.user.save();
    
    res.json({ success: true, isFavorite, favorites });
  } catch (error) {
    res.status(500).json({ detail: 'Server error' });
  }
});

// Get detailed user statistics for profile
router.get('/user-stats', authenticate, async (req, res) => {
  try {
    const submissions = await Submission.find({ user_id: req.user._id })
      .populate('problem_id', 'title difficulty');

    const totalEasy = await Problem.countDocuments({ difficulty: 'Easy' });
    const totalMedium = await Problem.countDocuments({ difficulty: 'Medium' });
    const totalHard = await Problem.countDocuments({ difficulty: 'Hard' });
    const totalProblems = await Problem.countDocuments();
      
    const solvedSet = new Set();
    const stats = {
      username: req.user.username,
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      totalProblems,
      totalEasy,
      totalMedium,
      totalHard,
      recentSubmissions: [],
      streak: req.user.streak || 0 // use real streak
    };

    // Calculate solved stats based on Accepted submissions
    submissions.forEach(sub => {
      if ((sub.status === 'Accepted' || sub.status === 'Partially Accepted') && sub.problem_id) {
        const pId = sub.problem_id._id.toString();
        if (!solvedSet.has(pId)) {
          solvedSet.add(pId);
          stats.totalSolved++;
          if (sub.problem_id.difficulty === 'Easy') stats.easySolved++;
          else if (sub.problem_id.difficulty === 'Medium') stats.mediumSolved++;
          else if (sub.problem_id.difficulty === 'Hard') stats.hardSolved++;
        }
      }
    });

    // Get 10 most recent submissions regardless of status
    stats.recentSubmissions = submissions
      .sort((a, b) => b.created_at - a.created_at)
      .slice(0, 10)
      .map(sub => ({
        id: sub._id,
        problem_id: sub.problem_id ? sub.problem_id._id : null,
        title: sub.problem_id ? sub.problem_id.title : 'Unknown Problem',
        status: sub.status,
        language: sub.language,
        timestamp: sub.created_at
      }));

    res.json(stats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ detail: 'Server error' });
  }
});

export default router;
