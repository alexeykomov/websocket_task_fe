import React from 'react';
import {
  act,
  fireEvent,
  getByTestId,
  render,
  waitFor,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import App from '../App';
import { store } from '../store';
import { createMatchMediaFalseImpl } from '../../util/test-utils';

//mock window.matchMedia
const orig = window.matchMedia;

describe('App', () => {
  beforeAll(() => {
    window.matchMedia = jest
      .fn()
      .mockImplementation(createMatchMediaFalseImpl({}));
  });

  it('renders without crashing', () => {
    window.matchMedia = jest.fn().mockImplementation(
      createMatchMediaFalseImpl({
        '(max-width: 800px)': true,
        '(max-width: 767px)': true,
      })
    );
    const { getByTestId } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(getByTestId('app')).toBeInTheDocument();
  });

  it('uses large app layout for large screen', () => {
    window.matchMedia = jest.fn().mockImplementation(
      createMatchMediaFalseImpl({
        '(max-width: 800px)': false,
        '(max-width: 767px)': false,
      })
    );
    const { getByTestId } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(getByTestId('app-large-screen')).toBeInTheDocument();
  });

  it('uses small app layout for small screen', () => {
    window.matchMedia = jest.fn().mockImplementation(
      createMatchMediaFalseImpl({
        '(max-width: 800px)': false,
        '(max-width: 767px)': true,
      })
    );
    const { getByTestId } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(getByTestId('app-task-list-overlay')).toBeInTheDocument();
  });

  it('opens and closes the sidebar', async () => {
    window.matchMedia = jest.fn().mockImplementation(
      createMatchMediaFalseImpl({
        '(max-width: 800px)': true,
        '(max-width: 767px)': true,
      })
    );
    const { getByTestId } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(getByTestId('app-task-list-container')).toHaveClass(
      'app-body-menu-closed'
    );
    await act(() => {
      getByTestId('menu-toggle-button').click();
    });
    expect(getByTestId('app-task-list-container')).toHaveClass(
      'app-body-menu-opening'
    );
    // Simulate the transitionend event.
    await act(() => {
      fireEvent.transitionEnd(getByTestId('app-task-list-container'));
    });

    // Wait for the transition to complete.
    await waitFor(() => {
      expect(getByTestId('app-task-list-container')).toHaveClass(
        'app-body-menu-opened'
      );
    });

    await act(() => {
      getByTestId('menu-close-button').click();
    });
    expect(getByTestId('app-task-list-container')).toHaveClass(
      'app-body-menu-closing'
    );
    await act(() => {
      fireEvent.transitionEnd(getByTestId('app-task-list-container'));
    });
    await waitFor(() => {
      expect(getByTestId('app-task-list-container')).toHaveClass(
        'app-body-menu-closed'
      );
    });
  });

  it('opens and closes the sidebar for large screen', async () => {
    window.matchMedia = jest.fn().mockImplementation(
      createMatchMediaFalseImpl({
        '(max-width: 800px)': false,
        '(max-width: 767px)': false,
      })
    );
    const { getByTestId } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(getByTestId('app-large-screen')).toHaveClass('app-body-menu-opened');
    await act(() => {
      getByTestId('menu-toggle-button').click();
    });
    expect(getByTestId('app-large-screen')).toHaveClass(
      'app-body-menu-closing'
    );
    // Simulate the transitionend event.
    await act(() => {
      fireEvent.transitionEnd(getByTestId('app-large-screen'));
    });

    // Wait for the transition to complete.
    await waitFor(() => {
      expect(getByTestId('app-large-screen')).toHaveClass(
        'app-body-menu-closed'
      );
    });

    await act(() => {
      getByTestId('menu-toggle-button').click();
    });
    expect(getByTestId('app-large-screen')).toHaveClass(
      'app-body-menu-opening'
    );
    await act(() => {
      fireEvent.transitionEnd(getByTestId('app-large-screen'));
    });
    await waitFor(() => {
      expect(getByTestId('app-large-screen')).toHaveClass(
        'app-body-menu-opened'
      );
    });
  });

  afterAll(() => {
    window.matchMedia = orig;
  });
});
