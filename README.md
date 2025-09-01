## AWS Amplify React+Vite Starter Template

This application was built from the AWS Amplify starter template for creating applications using React+Vite, emphasizing easy setup for authentication, API, and database capabilities.

## Overview

The template equips you with a foundational React application integrated with AWS Amplify, streamlined for scalability and performance. It is ideal for developers looking to jumpstart their project with pre-configured AWS services like Cognito, AppSync, and DynamoDB. 

## Features

- **Authentication**: Setup with Amazon Cognito for secure email authentication.
  - As seen in the flashcard application, the sign-up flow has built-in attributes that you can customize.
- **API**: Ready-to-use GraphQL endpoint with AWS AppSync.
  - Backend is confiured automatically on push to main branch
- **Database**: Real-time database powered by Amazon DynamoDB.
  - Database CRUD operations via client.models (Note: Schemas must be created prior to deployment)

## Deploying to AWS

For detailed instructions on deploying your own application, refer to the [deployment section](https://docs.amplify.aws/react/start/quickstart/#deploy-a-fullstack-app-to-aws) of the AWS documentation.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
