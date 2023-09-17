export default {
    //verbose: false,
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    testMatch: ["**/?(*.)+(test).js"],
    setupFilesAfterEnv: ["./jest.console.js"]
};
