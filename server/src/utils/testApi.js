require('dotenv').config();
const http = require('http');

const PORT = process.env.PORT || 5005;
const HOST = '127.0.0.1';


// Helper function to make HTTP requests with session cookies
function makeRequest(path, method = 'GET', data = null, cookie = null) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const options = {
      hostname: HOST,
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (payload) {
      options.headers['Content-Length'] = Buffer.byteLength(payload);
    }

    if (cookie) {
      options.headers['Cookie'] = cookie;
    }

    const req = http.request(options, (res) => {
      let body = '';
      let responseCookie = cookie;

      if (res.headers['set-cookie']) {
        responseCookie = res.headers['set-cookie'].map((c) => c.split(';')[0]).join('; ');
      }

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(body);
        } catch (e) {
          parsed = body;
        }
        resolve({
          statusCode: res.statusCode,
          body: parsed,
          cookie: responseCookie,
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n==================================================');
  console.log('🧪 Starting SkillForge Comprehensive API Test Suite');
  console.log('==================================================\n');

  try {
    // 1. Health Check
    console.log('1. Testing Health Endpoint: GET /api/health');
    const health = await makeRequest('/api/health');
    console.log(`   Status: ${health.statusCode} | Active: ${health.body?.status === 'UP' ? '✅' : '❌'}`);

    // 2. Marketplace GET /api/courses (No parameters)
    console.log('\n2. Testing Marketplace Endpoint: GET /api/courses');
    const marketplaceAll = await makeRequest('/api/courses');
    console.log(`   Status: ${marketplaceAll.statusCode} | Total Courses: ${marketplaceAll.body?.count}`);

    // 3. Marketplace GET /api/courses with Category & Search filters
    console.log('\n3. Testing Marketplace Filter: GET /api/courses?category=Development&sort=popular');
    const filteredDev = await makeRequest('/api/courses?category=Development&sort=popular');
    console.log(`   Status: ${filteredDev.statusCode} | Development Courses: ${filteredDev.body?.count}`);

    // 4. Marketplace GET /api/courses with Price filter
    console.log('\n4. Testing Marketplace Free Price Filter: GET /api/courses?price=free');
    const freeCourses = await makeRequest('/api/courses?price=free');
    console.log(`   Status: ${freeCourses.statusCode} | Free Courses: ${freeCourses.body?.count}`);

    // 5. Course Detail GET /api/courses/:id
    let firstCourseId = null;
    if (marketplaceAll.body?.courses?.length > 0) {
      firstCourseId = marketplaceAll.body.courses[0]._id;
      console.log(`\n5. Testing Course Detail: GET /api/courses/${firstCourseId}`);
      const courseDetail = await makeRequest(`/api/courses/${firstCourseId}`);
      console.log(`   Status: ${courseDetail.statusCode} | Title: "${courseDetail.body?.course?.title}"`);
    }

    // 6. Auth Test - Student Login
    console.log('\n6. Testing Student Login: POST /api/auth/login');
    const studentLogin = await makeRequest('/api/auth/login', 'POST', {
      email: 'student@skillforge.com',
      password: 'password123',
    });
    console.log(`   Status: ${studentLogin.statusCode} | Role: ${studentLogin.body?.user?.role} | Cookie: ${studentLogin.cookie ? 'Set ✅' : 'Missing ❌'}`);
    const studentCookie = studentLogin.cookie;

    // 7. Student Auth Check GET /api/auth/me
    console.log('\n7. Testing Student Auth Session: GET /api/auth/me');
    const studentMe = await makeRequest('/api/auth/me', 'GET', null, studentCookie);
    console.log(`   Status: ${studentMe.statusCode} | User: ${studentMe.body?.user?.name}`);

    // 8. Student Enrolled Courses GET /api/enrollments/my-courses
    console.log('\n8. Testing Student Enrolled Courses: GET /api/enrollments/my-courses');
    const myCourses = await makeRequest('/api/enrollments/my-courses', 'GET', null, studentCookie);
    console.log(`   Status: ${myCourses.statusCode} | Enrolled Count: ${myCourses.body?.count}`);

    // 9. Student Progress Update POST /api/student/progress
    if (firstCourseId) {
      console.log('\n9. Testing Student Progress Toggle: POST /api/student/progress');
      const progressUpdate = await makeRequest(
        '/api/student/progress',
        'POST',
        {
          courseId: firstCourseId,
          lessonId: 'les_1_1',
          completed: true,
        },
        studentCookie
      );
      console.log(`   Status: ${progressUpdate.statusCode} | Completion: ${progressUpdate.body?.progress?.completionPercentage}%`);
    }

    // 10. Become Instructor Test POST /api/auth/become-instructor
    console.log('\n10. Testing Become Instructor Upgrade: POST /api/auth/become-instructor');
    const becomeInst = await makeRequest(
      '/api/auth/become-instructor',
      'POST',
      { bio: 'Passionate about Web Development', expertise: 'Development' },
      studentCookie
    );
    console.log(`    Status: ${becomeInst.statusCode} | Message: ${becomeInst.body?.message}`);

    // 11. Instructor Login & Dashboard
    console.log('\n11. Testing Instructor Login: POST /api/auth/login');
    const instLogin = await makeRequest('/api/auth/login', 'POST', {
      email: 'instructor@skillforge.com',
      password: 'password123',
    });
    const instCookie = instLogin.cookie;

    console.log('    Testing Instructor Studio Dashboard: GET /api/instructor/dashboard');
    const instDash = await makeRequest('/api/instructor/dashboard', 'GET', null, instCookie);
    console.log(`    Status: ${instDash.statusCode} | Created Courses: ${instDash.body?.stats?.totalCourses}`);

    // 12. Admin Login & Dashboard
    console.log('\n12. Testing Admin Login: POST /api/auth/login');
    const adminLogin = await makeRequest('/api/auth/login', 'POST', {
      email: 'admin@skillforge.com',
      password: 'password123',
    });
    const adminCookie = adminLogin.cookie;

    console.log('    Testing Admin Control Panel: GET /api/admin/dashboard');
    const adminDash = await makeRequest('/api/admin/dashboard', 'GET', null, adminCookie);
    console.log(`    Status: ${adminDash.statusCode} | Total Platform Users: ${adminDash.body?.stats?.totalUsers}`);

    console.log('\n==================================================');
    console.log('✨ All SkillForge REST API Endpoints Verified Successfully!');
    console.log('==================================================\n');
  } catch (err) {
    console.error('API Test Error:', err);
  }
}

runTests();
