import { Body, Container, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react';

export function CurrentWeatherTemplate(
  weather:CurrentWeather
) {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Body className="bg-gray-100 text-black font-sans">
          <Container className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto mt-8">
            <Heading className="text-2xl font-bold text-center mb-4">
              🌤️ Weather Update
            </Heading>
            <Section className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
              <Text><strong>🌡️ Temperature:</strong> {weather.temperature}°C</Text>
              <Text><strong>💧 Humidity:</strong> {weather.humidity}%</Text>
              <Text><strong>🌤️ Description:</strong> {weather.description}</Text>
            </Section>

            <Text className="text-center text-sm text-gray-500 mt-6">
              Thank you for subscribing to our Weather Updates!
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
