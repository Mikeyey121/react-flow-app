import App from './App';

test('always passes', () => {
  expect(true).toBe(true);
});

test('app exists', () => {
  expect(App).toBeDefined();
});
