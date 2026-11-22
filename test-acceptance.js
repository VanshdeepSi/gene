const http = require('http');

async function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        body: data,
      }));
    });
    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log("=== THE MENTALIST: DIGITAL DECEPTION - ACCEPTANCE TESTS ===");
  let passedCount = 0;
  let totalTests = 0;

  function assert(condition, testName, details = "") {
    totalTests++;
    if (condition) {
      console.log(`[PASS] Test ${totalTests}: ${testName}`);
      passedCount++;
    } else {
      console.error(`[FAIL] Test ${totalTests}: ${testName} - ${details}`);
    }
  }

  // Test 1: Home page loads with event title & portals
  const homeRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
  });
  assert(homeRes.statusCode === 200, "Home route returns HTTP 200");
  assert(homeRes.body.includes("THE MENTALIST"), "The Mentalist title present on Home");
  assert(homeRes.body.includes("DIGITAL DECEPTION"), "Digital Deception badge present on Home");
  assert(homeRes.body.includes("ENTER AS PARTICIPANT"), "Participant entry portal present on Home");
  assert(homeRes.body.includes("ENTER AS HANDLER"), "Handler entry portal present on Home");
  assert(homeRes.body.includes("₹5,000"), "Prize pool ₹5,000 present on Home");
  assert(!homeRes.body.includes("₹2,000"), "Old ₹2,000 prize pool completely removed from Home");
  assert(!homeRes.body.includes("₹100"), "Registration fee ₹100 completely removed from Home");
  assert(homeRes.body.includes("5 ROUNDS"), "5 Rounds badge/link present on Home");
  assert(!homeRes.body.includes("4 ROUNDS"), "Old '4 ROUNDS' references removed from Home");
  assert(homeRes.body.includes("LP105"), "Venue LP105 present on Home");

  // Test 2: Participant route loads directly without credentials
  const partRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/participant',
    method: 'GET'
  });
  assert(partRes.statusCode === 200, "Participant dashboard accessible without auth (HTTP 200)");
  assert(partRes.body.includes("Live Clue &amp; Incident Dispatches") || partRes.body.includes("Live Clue & Incident Dispatches"), "Dispatches feed container present on participant page");
  assert(partRes.body.includes("PARTICIPANT COMMAND TERMINAL"), "Participant command terminal present on participant page");
  assert(partRes.body.includes("₹5,000"), "Prize pool ₹5,000 present on participant page");
  assert(!partRes.body.includes("₹2,000"), "Old ₹2,000 prize pool completely removed from participant page");
  assert(!partRes.body.includes("₹100"), "Registration fee ₹100 completely removed from participant page");
  assert(partRes.body.includes("LP105"), "Venue LP105 present on participant page");
  assert(partRes.body.includes("5 ROUNDS"), "5 Rounds playbook present on participant page");

  // Test 3: Unauthenticated access to /organiser is protected
  const orgUnauthRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/organiser',
    method: 'GET'
  });
  const isRedirect = orgUnauthRes.statusCode === 307 || orgUnauthRes.statusCode === 302 || orgUnauthRes.statusCode === 308;
  const redirectTarget = orgUnauthRes.headers.location || "";
  assert(isRedirect && redirectTarget.includes('/organiser/login'), "Unauthenticated /organiser redirects to /organiser/login", `Status: ${orgUnauthRes.statusCode}, Location: ${redirectTarget}`);

  // Test 4: Wrong password shows ACCESS DENIED
  const wrongLoginRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({ password: 'WrongPassword123' }));
  assert(wrongLoginRes.statusCode === 401, "Invalid password returns HTTP 401");
  assert(wrongLoginRes.body.includes("ACCESS DENIED"), "Error response contains ACCESS DENIED message");

  // Test 5: Correct password grants clearance and sets httpOnly cookie
  const validLoginRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({ password: 'GeneBureau@2026' }));
  assert(validLoginRes.statusCode === 200, "Valid password returns HTTP 200");
  const cookies = validLoginRes.headers['set-cookie'] || [];
  const authCookie = cookies.find(c => c.startsWith('gene_bureau_token='));
  assert(!!authCookie, "Signed JWT auth cookie set on successful login");
  assert(authCookie && authCookie.includes('HttpOnly'), "Auth cookie is httpOnly");
  assert(authCookie && /samesite=strict/i.test(authCookie), "Auth cookie has SameSite=strict");

  const rawCookieHeader = authCookie ? authCookie.split(';')[0] : '';

  // Test 6: Direct unauthorized POST to /api/announcements is blocked
  const unauthPostRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/announcements',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({ title: 'Rogue Clue', message: 'Unauthorized test clue', category: 'General' }));
  assert(unauthPostRes.statusCode === 401, "Unauthenticated POST to /api/announcements returns HTTP 401");

  // Test 7: Direct unauthorized DELETE to /api/announcements is blocked
  const unauthDelRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/announcements?id=dispatch-mdd-01',
    method: 'DELETE'
  });
  assert(unauthDelRes.statusCode === 401, "Unauthenticated DELETE to /api/announcements returns HTTP 401");

  // Test 8: Authenticated POST creates announcement in feed
  const testTitle = "TEST FORENSIC CLUE DROP " + Date.now();
  const authPostRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/announcements',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': rawCookieHeader
    }
  }, JSON.stringify({
    title: testTitle,
    message: "Game master automated clue drop for The Mentalist investigation.",
    category: "Urgent",
    eventDate: "2026-11-23",
    pinned: true
  }));
  assert(authPostRes.statusCode === 201, "Authenticated POST returns HTTP 201 Created");
  const postBody = JSON.parse(authPostRes.body);
  const createdId = postBody.data?.id;
  assert(!!createdId, "Created announcement returned with unique ID");

  // Test 9: Public GET reflects the newly created dispatch
  const publicFeedRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/announcements',
    method: 'GET'
  });
  assert(publicFeedRes.statusCode === 200, "Public announcements GET returns HTTP 200");
  assert(publicFeedRes.headers['cache-control'].includes('no-store'), "Public feed enforces Cache-Control: no-store");
  assert(publicFeedRes.body.includes(testTitle), "Newly broadcast clue appears immediately in public feed");

  // Test 10: Authenticated DELETE removes the dispatch
  const authDelRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/announcements?id=${createdId}`,
    method: 'DELETE',
    headers: { 'Cookie': rawCookieHeader }
  });
  assert(authDelRes.statusCode === 200, "Authenticated DELETE returns HTTP 200");

  const verifyDelRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/announcements',
    method: 'GET'
  });
  assert(!verifyDelRes.body.includes(testTitle), "Expunged clue is removed from public feed");

  // Test 11: Custom 404 page in theme
  const notFoundRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/case-non-existent-void',
    method: 'GET'
  });
  assert(notFoundRes.statusCode === 404, "Unknown route returns HTTP 404");
  assert(notFoundRes.body.includes("Case File Not Found"), "Theme 404 page renders 'Case File Not Found'");

  console.log(`\n=== RESULTS: ${passedCount}/${totalTests} TESTS PASSED ===`);
  if (passedCount === totalTests) {
    console.log("VERDICT: PASS - ALL THE MENTALIST EVENT ACCEPTANCE CRITERIA SATISFIED");
    process.exit(0);
  } else {
    console.error("VERDICT: FAIL - ONE OR MORE CHECKS FAILED");
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Execution error:", err);
  process.exit(1);
});
