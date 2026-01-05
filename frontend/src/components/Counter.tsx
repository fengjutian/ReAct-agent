import React, { useState } from 'react';
import { Button } from './ui/button';

const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <Button onClick={() => setCount(count + 1)} variant="default" size="lg">
      count is {count}
    </Button>
  );
};

export default Counter;
