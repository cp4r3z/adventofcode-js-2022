export default {
    
        transform: {
            '^.+\\.(ts|tsx)$': 'ts-jest',
        },
    
    //verbose: false,
    setupFilesAfterEnv:["./jest.console.js"]
};
