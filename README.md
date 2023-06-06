# Introduction

Aims to increase collaboration with developers, ignite community building, and provide low-threshold one-click solutions for users who are not familiar with website development. We are relying on 4EVER LAND Hosting Templates to gather templates from a wide range of developers with low entry barriers.

# Process

Before starting template development, please make sure you have read this article completely and understand how to set configuration options in the template code (as shown in the example). Once your template development is complete, the next step is to fill out and submit this form: https://forms.gle/pQ14y488WyLCrhRd6
After submission, community developers will review the code, and if approved, the project will be included in the collection.

# Specification

To improve the chances of your project being included, we kindly request that you carefully review and adhere to the template development guidelines provided below. Should you have any additional suggestions or feedback, please don't hesitate to [contact us](https://discord.com/invite/4everland) at any time.
Code repository: The repository must be open source.
Template thumbnail: Recommended size is 360 x 160 pixels.
Template name: Should be no more than 30 characters.
Template description: Should be no more than 180 characters.
File configuration: We require  that template providers include a JSON file in the project for displaying user-defined configuration items. This is essential for configuring deployment settings. Once the template is deployed, we will place the JSON file in the root directory of the project. Users can retrieve the configuration information by sending a GET request.

# Example

Example of a configuration item .json file

```json
{
  "config": [
    {
      "name": "Avatar",
      "options": [
        {
          "type": "text",
          "key": "avatar",
          "value": "",
          "placeholder": "https://(100*100)"
        }
      ],
    },
    {
      "name": "Name",
      "options": [
        {
          "type": "text",
          "key": "name",
          "value": "",
          "placeholder": "Enter the name"
        }
      ],
    },
    {
      "name": "link1",
      "options": [
        {
          "type": "text",
          "key": "option1",
          "value": "",
          "placeholder": "Enter the name"
        },
        {
          "type": "text",
          "key": "option2",
          "value": "",
          "placeholder": "https://"
        }
      ],
    },
    {
      "name": "link2",
      "options": [
        {
          "type": "text",
          "key": "option3",
          "value": "",
          "placeholder": "Enter the name"
        },
        {
          "type": "text",
          "key": "option4",
          "value": "",
          "placeholder": "https://"
        }
      ]
    }
  ]
}

```

Configuration displayed at project deployment

[![](https://4everlogo.4everland.store/Configuration.jpg)](https://4everlogo.4everland.store/Configuration.jpg)
