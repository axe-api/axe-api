# Application Logic

<p class="description">
Axe API provides great convenience by creating routes and automatically managing HTTP requests. However, this is not enough for real-world applications, so we need to be able to integrate our own application logic into the API.
</p>

<ul class="intro">
  <li>You will learn</li>
  <li>What is application logic?</li>
  <li>How to mix automatic and manual operations?</li>
  <li>What tools do you have for application logic?</li>
</ul>

## Getting started

**_Application logic_** means basically the behavior of the API.

As developers, we can create many different APIs that have user database tables. Nevertheless, almost every API might act differently in the new user creation process.

The reason behind it is that almost every API has a different **_application logic_**. For example, in an API might check the user's email address from external resources to validate if the user is a customer of the company's other database resources. Or, you can send a special welcoming email to the user if they have a special domain email.

These kinds of additions are designed by the **domain**. There can be very different scenarios for each API's design. All of the custom scenarios that can not be standardized by Axe API are called **Application Logic**.

## The Axe API approach

Axe API is just a framework that provides handling the _best-practices_ by _model definitions_. It is **NOT** a **_no-code_** or **_low-code_** platform.

As a principle, the Axe API team doesn't believe that no-code platforms would for specialized applications. But also, we believe that we can provide a basic framework that handles the best-practices.

Axe API uses some connection points that are coded by yourself while it handles an HTTP request by model definition. By using this method, you are allowed to create an API with minimum effort.

## Methods

Axe API handles HTTP requests **_automatically_**. While doing that, it provides many methods that allow you to add your application logic;

- Middlewares
- Hooks
- Serializers

Before using any of these methods, you should understand the **HTTP Request-Response Cycle** clearly.

## Next steps

In this section, we tried to explain what is application logic.

In the next section, we are going to talk about the Request-Response cycle.
