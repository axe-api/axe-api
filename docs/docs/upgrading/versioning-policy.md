<script setup>
import ReleasePlan from './ReleasePlan.vue'
</script>

<style>
.release-table > table {
  width: 100%;
  display: inline-table;
}
</style>

# Versioning Policy

Axe API uses the semantic version system.

## Overview

Semantic versioning is a numbering system used in software development to indicate the compatibility and changes of a software version.

It consists of three parts: MAJOR.MINOR.PATCH.

MAJOR version changes indicate incompatible updates, MINOR version changes introduce new features without breaking compatibility, and PATCH version changes represent bug fixes without adding new features.

Pre-release and build metadata can also be included for additional information.

## Release plan

You can check the current release plan of Axe API.

<ReleasePlan />

<div class="release-table">

| Version | LTS | Release Date | Maintanence | EOL        |
| ------- | --- | ------------ | ----------- | ---------- |
| v1      | ✓   | 2024-01-01   | 2026-01-01  | 2027-01-01 |
| v0.30   |     | 2023-04-01   | 2023-04-01  | 2024-10-01 |
| v0.20   |     | 2022-10-01   | 2023-06-01  | 2024-01-01 |

</div>

## Breaking changes

At Axe API, we strive to provide a stable and reliable experience for our users.

We understand the importance of minimizing disruptions and ensuring a smooth transition when introducing changes to our API.

This section outlines our approach to handling breaking changes and our commitment to providing comprehensive upgrade guides.

### Gradual Evolution

We are dedicated to evolving the Axe API in a gradual manner, avoiding sudden and disruptive changes. We believe in maintaining compatibility whenever possible and minimizing the impact on existing integrations.

Our goal is to ensure that your applications continue to work seamlessly without requiring extensive modifications.

### Major Changes and Upgrade Guides

When a major change is introduced, which may involve significant alterations or require modifications to your code, we will provide a detailed upgrade guide.

This guide will assist you in understanding the changes, adapting your implementation, and maintaining compatibility with the latest version of the Axe API.

We aim to make the upgrade process as straightforward as possible, guiding you through any necessary adjustments.

### Breaking Changes Frequency

Starting from version 1 (v1) of the Axe API, we commit to a predictable schedule for introducing breaking changes. To provide a stable environment for our users, we will limit major breaking changes to occur approximately every two years.

This approach ensures that you have a reasonable timeframe to plan and implement the necessary updates, minimizing the disruption to your application's functionality.

## Feedback and Support

We value your feedback and are committed to providing assistance during the upgrade process. If you encounter any challenges or have questions regarding breaking changes or upgrades, our dedicated support team is available to help you. Feel free to reach out to us via our issues, and we will gladly provide the necessary guidance to ensure a smooth transition.

We understand the importance of stability and continuity for your applications, and we remain dedicated to delivering a reliable and developer-friendly experience throughout the evolution of the Axe API.
