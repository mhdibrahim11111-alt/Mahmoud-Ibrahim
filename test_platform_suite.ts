import { ALL_BADGES } from './src/types/achievements';

async function runTests() {
  console.log('=== 1. Testing Achievements Calculation ===');
  const dummyStats = {
    completedChaptersCount: 5,
    completedQuizzesCount: 3,
    completedExamPartsCount: 1,
    savedSnippetsCount: 2,
    notesCount: 2,
    bookmarkedCount: 3,
  };
  const unlocked = ALL_BADGES.filter((b) => b.isUnlocked(dummyStats));
  console.log(`Unlocked badges count: ${unlocked.length}/${ALL_BADGES.length}`);
  if (unlocked.length === 0) {
    throw new Error('Badge calculation test failed!');
  }
  console.log('✓ Achievements calculation passed.');

  console.log('\n=== 2. Testing Server Auth, Persistence & Snippets APIs ===');
  const baseUrl = 'http://localhost:3000';

  // Step A: Login with Teacher Code
  const authRes = await fetch(`${baseUrl}/api/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'ADM-7C81E920A3B54DF6' }),
  });
  const authData = await authRes.json();
  console.log('Teacher login result:', authData.valid, authData.role);
  if (!authData.valid || !authData.sessionToken) {
    throw new Error('Teacher auth failed');
  }

  // Step B: Generate Student Code
  const genRes = await fetch(`${baseUrl}/api/admin/codes/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authData.sessionToken}`,
    },
    body: JSON.stringify({
      studentName: 'طالب الاختبار الآلي',
      customCode: 'STD-AUTOMATED-' + Date.now().toString().slice(-4),
      role: 'student',
      durationDays: 30,
    }),
  });
  const genData = await genRes.json();
  console.log('Generate student code result:', genData.success, genData.code?.code);
  const studentCode = genData.code?.code;
  if (!studentCode) {
    throw new Error('Student code generation failed');
  }

  // Step C: Verify Student Code
  const stdAuthRes = await fetch(`${baseUrl}/api/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: studentCode }),
  });
  const stdAuthData = await stdAuthRes.json();
  console.log('Student login result:', stdAuthData.valid, stdAuthData.role, stdAuthData.studentName);
  const stdToken = stdAuthData.sessionToken;
  if (!stdAuthData.valid || !stdToken) {
    throw new Error('Student login failed');
  }

  // Step D: Save Progress (Lesson completed, Quiz completed, BugHunter completed, Challenge completed)
  const now = Date.now();
  const progressEntries = {
    'completedChapter:1': { value: true, updatedAt: now },
    'completedChapter:2': { value: true, updatedAt: now },
    'completedQuiz:part-1-bug-hunter': { value: true, updatedAt: now },
    'completedExam:1': { value: true, updatedAt: now },
    'chapterNote:1': { value: 'ملحوظة تجريبية على الدرس الأول', updatedAt: now },
    'bookmarkedChapter:1': { value: true, updatedAt: now },
  };

  const syncRes = await fetch(`${baseUrl}/api/progress/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${stdToken}`,
    },
    body: JSON.stringify({
      code: studentCode,
      lastChapterId: 2,
      stateEntries: progressEntries,
    }),
  });
  const syncData = await syncRes.json();
  console.log('Sync progress result:', syncData.success);

  // Step E: Fetch Progress & Verify Persistence
  const fetchProgRes = await fetch(`${baseUrl}/api/progress/fetch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${stdToken}`,
    },
    body: JSON.stringify({ code: studentCode }),
  });
  const fetchProgData = await fetchProgRes.json();
  console.log('Fetched progress entries count:', Object.keys(fetchProgData.progress?.stateEntries || {}).length);
  console.log('Last chapter ID:', fetchProgData.progress?.lastChapterId);
  if (fetchProgData.progress?.lastChapterId !== 2) {
    throw new Error('Progress persistence check failed!');
  }
  console.log('✓ Progress persistence passed.');

  // Step F: Save Snippet, List, and Delete Snippet
  const saveSnippetRes = await fetch(`${baseUrl}/api/student/snippets/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${stdToken}`,
    },
    body: JSON.stringify({
      id: 'snip-' + Date.now(),
      title: 'كود تجريبي للتحقق',
      code: 'console.log("Snippet persistence test");',
      language: 'javascript',
      createdAt: new Date().toISOString(),
    }),
  });
  const saveSnippetData = await saveSnippetRes.json();
  console.log('Save snippet result:', saveSnippetData.success);
  if (!saveSnippetData.success) {
    throw new Error('Snippet save failed');
  }

  // Fetch student work
  const workRes = await fetch(`${baseUrl}/api/student/work/fetch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${stdToken}`,
    },
    body: JSON.stringify({ code: studentCode }),
  });
  const workData = await workRes.json();
  console.log('Fetched snippets count:', workData.snippets?.length);
  const snippetId = workData.snippets?.[0]?.id;
  if (!snippetId) {
    throw new Error('Snippet was not returned in work fetch');
  }
  console.log('✓ Snippet saved successfully.');

  // Delete Snippet
  const delSnippetRes = await fetch(`${baseUrl}/api/student/snippets/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${stdToken}`,
    },
    body: JSON.stringify({ snippetId }),
  });
  const delSnippetData = await delSnippetRes.json();
  console.log('Delete snippet result:', delSnippetData.success);
  if (!delSnippetData.success) {
    throw new Error('Snippet deletion failed');
  }
  console.log('✓ Snippet deleted successfully.');

  console.log('\n=========================================');
  console.log('ALL VERIFICATION AND TEST SUITES PASSED! ✓');
  console.log('=========================================');
}

runTests().catch((err) => {
  console.error('Test Suite Error:', err);
  process.exit(1);
});

