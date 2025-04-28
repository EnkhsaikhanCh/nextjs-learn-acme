/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

const config: Config = {
  testTimeout: 15000, // 15 секунд

  // All imported modules in your tests should be mocked automatically
  // automock: false,

  // Stop running tests after `n` failures
  // bail: 0,

  // The directory where Jest should store its cached dependency information
  // cacheDirectory: "/private/var/folders/zt/v32k1tb92q75f3442ly8_w6w0000gn/T/jest_dx",

  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    "src/**/*.{ts,tsx,js,jsx}", // Include all files in `src` directory
    "!src/**/*.d.ts", // Exclude TypeScript declaration files
    "!src/lib/**", // Exclude all files in the `lib` directory
    "!src/components/ui/**", // Exclude all UI components
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "src/hooks",
    "src/lib/utils.ts",
    "src/middleware.ts",
    "src/providers",
    "src/handler.ts",
    "src/scripts/seed-admin.ts",
    "src/store/UserStoreState.ts",

    // src/confiq
    "src/config/lessonTypeConfig.ts",

    // src/components
    "src/components/ui",
    "src/components/dashboard",
    "src/components/CourseNotFound.tsx",
    "src/components/InfoRow.tsx",
    "src/components/LoadingOverlay.tsx",
    "src/components/PasswordInput.tsx",
    "src/components/LoadingScreen.tsx",
    "src/components/active-theme.tsx",
    "src/components/SubscribeForm.tsx",
    "src/components/delete-confirmation.tsx",
    "src/components/rich-text-editor",

    // src/app
    "src/app/admin",
    "src/app/instructor",
    "src/app/dashboard",
    "src/app/error.tsx",
    "src/app/loading.tsx",
    "src/app/not-found.tsx",
    "src/app/page.tsx",
    "src/app/layout.tsx",

    // src/app/api (not graphql)
    "src/app/api/auth",
    "src/app/api/payment",
    "src/app/api/email",
    "src/app/api/health",

    // src/utils
    "src/utils/generate-unique-student-id",
    "src/utils/validateLessonInput.ts",
    "src/utils/sanitize.ts",
    "src/utils/validation.ts",
    "src/utils/slug-to-label.ts",
    "src/utils/lesson.tsx",

    // src/app/(auth)
    "src/app/\\(auth\\)/forgot-password",
    "src/app/\\(auth\\)/reset-password",
    "src/app/\\(auth\\)/verify-otp",
    "src/app/\\(auth\\)/login",
    "src/app/\\(auth\\)/layout.tsx",

    // src/app/(register)
    "src/app/\\(register\\)/features",
    "src/app/\\(register\\)/signup",

    // graphql index.ts
    "src/app/api/graphql/resolvers/index.ts",
    "src/app/api/graphql/resolvers/mutations/index.ts",
    "src/app/api/graphql/resolvers/mutations/test/index.ts",
    "src/app/api/graphql/resolvers/mutations/section/index.ts",
    "src/app/api/graphql/resolvers/mutations/payment/index.ts",
    "src/app/api/graphql/resolvers/mutations/subscriber/index.ts",
    "src/app/api/graphql/resolvers/mutations/user/index.ts",
    "src/app/api/graphql/resolvers/mutations/userV2/index.ts",
    "src/app/api/graphql/resolvers/mutations/lessonV2/index.ts",
    "src/app/api/graphql/resolvers/mutations/lesson/index.ts",
    "src/app/api/graphql/resolvers/mutations/course/index.ts",
    "src/app/api/graphql/resolvers/mutations/auth/index.ts",
    "src/app/api/graphql/resolvers/queries/index.ts",
    "src/app/api/graphql/resolvers/queries/test/index.ts",
    "src/app/api/graphql/resolvers/queries/test/index.ts",
    "src/app/api/graphql/resolvers/queries/test/index.ts",

    // graphQL
    "src/generated",
    "src/app/api/graphql/route.ts",
    "src/app/api/graphql/apollo-client.ts",
    "src/app/api/graphql/ApolloWrappre.tsx",

    // src/app/api/graphql/
    "src/app/api/graphql/models",
    "src/app/api/graphql/schemas",
    // Mutations
    "src/app/api/graphql/resolvers/mutations/enrollment",
    "src/app/api/graphql/resolvers/mutations/lesson/create-lesson-mutation.ts",
    "src/app/api/graphql/resolvers/mutations/section/create-section-mutation.ts",
    "src/app/api/graphql/resolvers/mutations/section/delete-section-mutation.ts",
    "src/app/api/graphql/resolvers/mutations/section/update-section-mutation.ts",
    "src/app/api/graphql/resolvers/mutations/lessonV2/create-lesson-v2-mutation.ts",
    "src/app/api/graphql/resolvers/mutations/lessonV2/delete-lesson-v2-mutation.ts",
    "src/app/api/graphql/resolvers/mutations/lessonV2/create-mux-upload-url-mutation.ts",
    "src/app/api/graphql/resolvers/mutations/lessonV2/update-lesson-v2-general-info-mutation.ts",
    "src/app/api/graphql/resolvers/mutations/lessonV2/update-lesson-v2-mutation.ts",
    "src/app/api/graphql/resolvers/mutations/lessonV2/update-lesson-v2-video-mutation.ts",
    "src/app/api/graphql/resolvers/mutations/payment/updateOrCreateEnrollment.ts",
    "src/app/api/graphql/resolvers/mutations/userV2",
    // Queries
    "src/app/api/graphql/resolvers/queries/course/get-all-course-with-enrollment-query.ts",
    "src/app/api/graphql/resolvers/queries/course/get-course-details-for-instructor-query.ts",
    "src/app/api/graphql/resolvers/queries/course/get-all-course.ts",
    "src/app/api/graphql/resolvers/queries/course/get-course-by-id-query.ts",
    "src/app/api/graphql/resolvers/queries/course/get-course-by-slug-query.ts",
    "src/app/api/graphql/resolvers/queries/course/get-course-for-user-query.ts",
    "src/app/api/graphql/resolvers/queries/course/get-course-id-by-slug-query.ts",
    "src/app/api/graphql/resolvers/queries/course/get-enrolled-course-content-by-slug-query.ts",
    "src/app/api/graphql/resolvers/queries/lessonV2/get-lesson-v2-by-id-for-student-query.ts",
    "src/app/api/graphql/resolvers/queries/enrollment/check-enrollment-query.ts",
    "src/app/api/graphql/resolvers/queries/enrollment/get-enrollment-by-user-and-course.ts",
    "src/app/api/graphql/resolvers/queries/section",
    "src/app/api/graphql/resolvers/queries/payment",
    "src/app/api/graphql/resolvers/queries/userV2",

    // api
    "src/app/api/mux/token",
    "src/app/api/webhook/mux",

    // Sentry
    "src/instrumentation-client.ts",
    "src/instrumentation.ts",
    "src/app/api/sentry-example-api/route.ts",
    "src/app/sentry-example-page/page.tsx",
  ],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ["json", "text", "lcov", "clover"],

  // An object that configures minimum threshold enforcement for coverage results
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: -10,
    },
  },

  // A path to a custom dependency extractor
  // dependencyExtractor: undefined,

  // Make calling deprecated APIs throw helpful error messages
  // errorOnDeprecated: false,

  // The default configuration for fake timers
  // fakeTimers: {
  //   "enableGlobally": false
  // },

  // Force coverage collection from ignored files using an array of glob patterns
  // forceCoverageMatch: [],

  // A path to a module which exports an async function that is triggered once before all test suites
  // globalSetup: undefined,

  // A path to a module which exports an async function that is triggered once after all test suites
  // globalTeardown: undefined,

  // A set of global variables that need to be available in all test environments
  // globals: {},

  // The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
  // maxWorkers: "50%",

  // An array of directory names to be searched recursively up from the requiring module's location
  // moduleDirectories: [
  //   "node_modules"
  // ],

  // An array of file extensions your modules use
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  // moduleNameMapper: {},

  // An array of regexp pattern strings, matched against all module paths before considered 'visible' to the module loader
  // modulePathIgnorePatterns: [],

  // Activates notifications for test results
  // notify: false,

  // An enum that specifies notification mode. Requires { notify: true }
  // notifyMode: "failure-change",

  // A preset that is used as a base for Jest's configuration
  preset: "ts-jest", // TypeScript-ийг Jest-тэй ашиглах

  // Run tests from one or more projects
  // projects: undefined,

  // Use this configuration option to add custom reporters to Jest
  // reporters: undefined,

  // Automatically reset mock state before every test
  // resetMocks: false,

  // Reset the module registry before running each individual test
  // resetModules: false,

  // A path to a custom resolver
  // resolver: undefined,

  // Automatically restore mock state and implementation before every test
  // restoreMocks: false,

  // The root directory that Jest should scan for tests and modules within
  // rootDir: undefined,

  // A list of paths to directories that Jest should use to search for files in
  // roots: [
  //   "<rootDir>"
  // ],

  // Allows you to use a custom runner instead of Jest's default test runner
  // runner: "jest-runner",

  // The paths to modules that run some code to configure or set up the testing environment before each test
  // setupFiles: [],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ["./jest.setup.ts"],

  // The number of seconds after which a test is considered as slow and reported as such in the results.
  // slowTestThreshold: 5,

  // A list of paths to snapshot serializer modules Jest should use for snapshot testing
  // snapshotSerializers: [],

  // The test environment that will be used for testing
  testEnvironment: "jsdom",

  // Options that will be passed to the testEnvironment
  // testEnvironmentOptions: {},

  // Adds a location field to test results
  // testLocationInResults: false,

  // The glob patterns Jest uses to detect test files
  testMatch: ["**/__tests__/**/*.[jt]s?(x)"],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  // testPathIgnorePatterns: [
  //   "/node_modules/"
  // ],

  // The regexp pattern or array of patterns that Jest uses to detect test files
  // testRegex: [],

  // This option allows the use of a custom results processor
  // testResultsProcessor: undefined,

  // This option allows use of a custom test runner
  // testRunner: "jest-circus/runner",

  // A map from regular expressions to paths to transformers
  // transform: undefined,

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  // transformIgnorePatterns: [
  //   "/node_modules/",
  //   "\\.pnp\\.[^\\/]+$"
  // ],

  // An array of regexp pattern strings that are matched against all modules before the module loader will automatically return a mock for them
  // unmockedModulePathPatterns: undefined,

  // Indicates whether each individual test should be reported during the run
  verbose: true,

  // An array of regexp patterns that are matched against all source file paths before re-running tests in watch mode
  // watchPathIgnorePatterns: [],

  // Whether to use watchman for file crawling
  // watchman: true,
};

export default createJestConfig(config);
