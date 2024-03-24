/* eslint-disable @typescript-eslint/require-await */
import {MockGithub} from '@kie/mock-github';
import path from 'path';
import assertions from './assertions/verifyPodfileAssertions';
import mocks from './mocks/verifyPodfileMocks';
import ExtendedAct from './utils/ExtendedAct';
import * as utils from './utils/utils';

jest.setTimeout(90 * 1000);
let mockGithub: MockGithub;

const FILES_TO_COPY_INTO_TEST_REPO = [
    ...utils.deepCopy(utils.FILES_TO_COPY_INTO_TEST_REPO),
    {
        src: path.resolve(__dirname, '..', '.github', 'workflows', 'verifyPodfile.yml'),
        dest: '.github/workflows/verifyPodfile.yml',
    },
];

describe('test workflow verifyPodfile', () => {
    const githubToken = 'dummy_github_token';
    const actor = 'Dummy Actor';
    const osbotifyActor = 'OSBotify';

    beforeAll(async () => {
        // in case of the tests being interrupted without cleanup the mock repo directory may be left behind
        // which breaks the next test run, this removes any possible leftovers
        utils.removeMockRepoDir();
    });

    beforeEach(async () => {
        // create a local repository and copy required files
        mockGithub = new MockGithub({
            repo: {
                testVerifyPodfileWorkflowRepo: {
                    files: FILES_TO_COPY_INTO_TEST_REPO,
                },
            },
        });

        await mockGithub.setup();
    });

    afterEach(async () => {
        await mockGithub.teardown();
    });
    describe('pull request opened', () => {
        const event = 'pull_request';
        const eventOptions = {
            action: 'opened',
        };
        it('executes workflow', async () => {
            const repoPath = mockGithub.repo.getPath('testVerifyPodfileWorkflowRepo') ?? '';
            const workflowPath = path.join(repoPath, '.github', 'workflows', 'verifyPodfile.yml');
            let act = new ExtendedAct(repoPath, workflowPath);
            act = utils.setUpActParams(act, event, eventOptions, {}, githubToken);
            act = utils.setJobRunners(act, {verify: 'ubuntu-latest'}, workflowPath);
            const testMockSteps = {
                verify: mocks.VERIFYPODFILE__VERIFY__STEP_MOCKS,
            };
            const result = await act.runEvent(event, {
                workflowFile: path.join(repoPath, '.github', 'workflows', 'verifyPodfile.yml'),
                mockSteps: testMockSteps,
                actor,
                logFile: utils.getLogFilePath('verifyPodfile', expect.getState().currentTestName),
            });

            assertions.assertVerifyJobExecuted(result);
        });
        describe('actor is OSBotify', () => {
            it('does not execute workflow', async () => {
                const repoPath = mockGithub.repo.getPath('testVerifyPodfileWorkflowRepo') ?? '';
                const workflowPath = path.join(repoPath, '.github', 'workflows', 'verifyPodfile.yml');
                let act = new ExtendedAct(repoPath, workflowPath);
                act = utils.setUpActParams(act, event, eventOptions, {}, githubToken);
                act = utils.setJobRunners(act, {verify: 'ubuntu-latest'}, workflowPath);
                const testMockSteps = {
                    verify: mocks.VERIFYPODFILE__VERIFY__STEP_MOCKS,
                };
                const result = await act.runEvent(event, {
                    workflowFile: path.join(repoPath, '.github', 'workflows', 'verifyPodfile.yml'),
                    mockSteps: testMockSteps,
                    actor: osbotifyActor,
                    logFile: utils.getLogFilePath('verifyPodfile', expect.getState().currentTestName),
                });

                assertions.assertVerifyJobExecuted(result, false);
            });
        });
    });
    describe('pull request synchronized', () => {
        const event = 'pull_request';
        const eventOptions = {
            action: 'synchronize',
        };
        it('executes workflow', async () => {
            const repoPath = mockGithub.repo.getPath('testVerifyPodfileWorkflowRepo') ?? '';
            const workflowPath = path.join(repoPath, '.github', 'workflows', 'verifyPodfile.yml');
            let act = new ExtendedAct(repoPath, workflowPath);
            act = utils.setUpActParams(act, event, eventOptions, {}, githubToken);
            act = utils.setJobRunners(act, {verify: 'ubuntu-latest'}, workflowPath);
            const testMockSteps = {
                verify: mocks.VERIFYPODFILE__VERIFY__STEP_MOCKS,
            };
            const result = await act.runEvent(event, {
                workflowFile: path.join(repoPath, '.github', 'workflows', 'verifyPodfile.yml'),
                mockSteps: testMockSteps,
                actor,
                logFile: utils.getLogFilePath('verifyPodfile', expect.getState().currentTestName),
            });

            assertions.assertVerifyJobExecuted(result);
        });
        describe('actor is OSBotify', () => {
            it('does not execute workflow', async () => {
                const repoPath = mockGithub.repo.getPath('testVerifyPodfileWorkflowRepo') ?? '';
                const workflowPath = path.join(repoPath, '.github', 'workflows', 'verifyPodfile.yml');
                let act = new ExtendedAct(repoPath, workflowPath);
                act = utils.setUpActParams(act, event, eventOptions, {}, githubToken);
                act = utils.setJobRunners(act, {verify: 'ubuntu-latest'}, workflowPath);
                const testMockSteps = {
                    verify: mocks.VERIFYPODFILE__VERIFY__STEP_MOCKS,
                };
                const result = await act.runEvent(event, {
                    workflowFile: path.join(repoPath, '.github', 'workflows', 'verifyPodfile.yml'),
                    mockSteps: testMockSteps,
                    actor: osbotifyActor,
                    logFile: utils.getLogFilePath('verifyPodfile', expect.getState().currentTestName),
                });

                assertions.assertVerifyJobExecuted(result, false);
            });
        });
    });
});
