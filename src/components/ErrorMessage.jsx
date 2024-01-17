import React from 'react';

function ErrorMessage({ messages }) {
  return (
    <>
      {messages.length > 0 && (
        <div className="alert alert-danger">
          {messages &&
            messages.map((msg) => {
              return <p key={msg}>{msg}</p>;
            })}
        </div>
      )}
    </>
  );
}

export default ErrorMessage;
