import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

const ExampleComponent = () => {
  return <div>Hello, World!</div>;
};

test('renders Hello, World!', () => {
  act(() => {
    render(<ExampleComponent />);
  });
  expect(screen.getByText('Hello, World!')).toBeInTheDocument();
});
