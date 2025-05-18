import { Body, Heading, Link, Tailwind, Text } from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react';

export function ConfirmSubscribeTemplate(
  token:string
) {
  return (
  <Tailwind>
    <Html>
      <Body className="text-black">
        <Heading>Email confirmation</Heading>
        <Text>
          Hello! To confirm your subscription you need to enter this token into the form:
        </Text>
        <Text
          className="mt-4 p-3 bg-gray-100 text-center text-xl font-mono tracking-widest rounded"
          style={{ 
            letterSpacing: '0.3em', 
            userSelect: 'all' 
          }}
        >
          {token}
        </Text>
        <Text>
          If you haven't made a subscription request, ignore this message.
        </Text>
      </Body>
    </Html>
  </Tailwind>
);
}
