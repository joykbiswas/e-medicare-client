"use client";
import { useEffect } from "react";

const AboutError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () =>void
}) => {
  useEffect(() => {
    console.log(error);
  }, []);
  return (
    <div>
      <h1>Something went wrong: Please try again !</h1>
      <button onClick={() => reset()}>Retry</button>
    </div>
  );
};

export default AboutError;
