import { act } from '@testing-library/react-hooks';
import { createSwitchNavigator, NavigationContainerComponent } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import sinon, { SinonSandbox } from 'sinon';
import { HistoryService } from '.';
import { renderNavigation } from '../../test-fixtures/navigation-test-utils';
import FullPageLoading from '../../pages/General/FullPageLoading';

describe('HistoryService', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
        jest.resetModules();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    describe('navigateAsRoot', () => {
        it('should call navigate on root navigator, but not non-root navigators', () => {
            const fakeRootNav = {
                dispatch: jest.fn(),
            };
            const fakeSubNav = {
                navigate: jest.fn(),
                push: jest.fn(),
                dispatch: jest.fn(),
            };

            const historyService = new HistoryService();
            historyService.setRootNavigation((fakeRootNav as unknown) as NavigationContainerComponent);
            historyService.setNavigation(fakeSubNav);

            historyService.navigateAsRoot('/somewhere', {
                enemy: 'White Walkers',
            });

            expect(fakeRootNav.dispatch).toBeCalled();
            expect(fakeSubNav.navigate).not.toBeCalled();
            expect(fakeSubNav.dispatch).not.toBeCalled();
            expect(fakeSubNav.push).not.toBeCalled();
        });

        it('should set navigator prop when setting root navigator.', () => {
            const fakeRootNav = {
                push: jest.fn(),
                dispatch: jest.fn(),
            };

            const historyService = new HistoryService();
            historyService.setRootNavigation((fakeRootNav as unknown) as NavigationContainerComponent);

            historyService.push('/somewhere', { enemy: 'White Walkers' });

            expect(fakeRootNav.dispatch).toBeCalled();
        });
    });

    describe('push', () => {
        it('should call push on StackNavigators', async () => {
            const stackNav = createStackNavigator({
                '/a': FullPageLoading,
            });
            const hservice = new HistoryService();

            const tree = renderNavigation(hservice, stackNav);

            await act(async () => {
                await new Promise(setImmediate);
            });
            expect(tree.asJSON()).toBeTruthy();

            hservice.push('/a');

            // TODO: I haven't been able to figure out how to assert push is called,
            // for now check that both branches are covered in unit test coverage.
        });

        it('should call navigate on non StackNavigators', async () => {
            const stackNav = createSwitchNavigator({
                '/a': FullPageLoading,
            });
            const hservice = new HistoryService();

            const tree = renderNavigation(hservice, stackNav);

            await act(async () => {
                await new Promise(setImmediate);
            });
            expect(tree.asJSON()).toBeTruthy();

            hservice.push('/a');

            // TODO: I haven't been able to figure out how to assert push is called,
            // for now check that both branches are covered in unit test coverage.
        });

        it('shuold gracefully handle missing navigation', () => {
            const warn = sandbox.stub(console, 'warn');
            const hservice = new HistoryService();
            hservice.push('/a');

            expect(warn.called).toBeTruthy();
        });
    });
});
