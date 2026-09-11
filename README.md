# Small Business Hub

PROJECT NAME: SmallBiz

CONTEXT

Build a modern, responsive web application called SmallBiz.

SmallBiz is a practical digital tool designed for small-business owners who may not have strong marketing, content-creation, design, or business-planning experience.

The platform should help a business owner:

1. Understand how to create effective social media content.

2. Create content for Facebook, TikTok, and Instagram.

3. Create professional advertising posters for their business.

4. Set business goals.

5. Track and update progress toward those goals.

6. Manage basic information about their business.

SmallBiz should feel like a simple business productivity application rather than a complicated marketing platform.

The interface must be easy enough for a small-business owner with limited technical experience to understand.

==================================================

NAVIGATION

==================================================

Use a left sidebar on desktop.

Keep the sidebar limited to EXACTLY these five main options:

1. Dashboard

2. Create Content

3. Create Poster

4. Goals & Tracking

5. My Business

Do not add unnecessary sidebar pages.

The active page should be visually highlighted.

On mobile, convert the sidebar into an appropriate responsive navigation pattern.

==================================================

1. DASHBOARD

==================================================

The Dashboard should act as the main overview of the business owner's activity and progress.

At the top, display a personalised welcome message such as:

"Welcome back, [Owner Name]"

or

"Welcome back, [Business Name]"

Include three clear quick-action buttons:

- Create Content

- Create Poster

- Set a Goal

These buttons must navigate to the relevant feature.

GOAL PROGRESS

Goal progress should be one of the most important parts of the Dashboard.

Display the user's active business goals.

Examples:

Monthly Sales

R9,000 of R15,000

60%

Instagram Followers

750 of 1,000

75%

New Customers

8 of 20

40%

Each goal should have:

- Goal name

- Target

- Current progress

- Progress bar

- Percentage completed

- Update Progress button

The business owner must be able to update goal progress directly from the Dashboard.

When they click "Update Progress", allow them to enter their latest value.

Example:

Current sales:

R9,000

New value:

R11,500

After saving, automatically recalculate the progress percentage and update the progress bar.

The same updated information must also appear on the Goals & Tracking page.

Do NOT create separate fake goal data for the Dashboard and Goals & Tracking page.

Both pages must use the same stored goal data.

Show a maximum of approximately 3 active goals on the Dashboard to avoid clutter.

Include a "View All Goals" link/button that takes the user to Goals & Tracking.

RECENT ACTIVITY

Include a small Recent Activity area.

Examples:

- Poster created

- Goal updated

- Content idea generated

- New goal created

Do not make this section unnecessarily large.

QUICK BUSINESS/CONTENT TIP

Include one small practical tip area.

Examples:

"Posts showing your product in use can help customers understand its value."

"Keep promotional captions simple and include a clear call to action."

Do not overcrowd the Dashboard with random statistics.

==================================================

2. CREATE CONTENT

==================================================

The Create Content page should HELP AND EDUCATE the business owner rather than simply presenting a generic AI prompt box.

The user should first choose a social media platform:

- Facebook

- TikTok

- Instagram

Use clear platform cards or tabs.

FACEBOOK

When Facebook is selected, show practical tips for creating Facebook content.

Examples:

- Clearly explain the value of the product or service.

- Use images that show the product or business.

- Include important information such as price, location or availability when relevant.

- Use a clear call to action.

- Keep promotional posts easy to understand.

INSTAGRAM

When Instagram is selected, show Instagram-specific guidance.

Examples:

- Use strong, visually appealing images.

- Keep captions engaging and easy to read.

- Use relevant hashtags.

- Show products, services or behind-the-scenes business content.

- Include a clear call to action.

TIKTOK

When TikTok is selected, show TikTok-specific guidance.

Examples:

- Capture attention within the first few seconds.

- Keep videos focused and engaging.

- Show the product or service in action.

- Use relevant trends when they make sense for the business.

- Demonstrate processes, transformations or behind-the-scenes moments.

- Finish with a clear call to action.

CONTENT CREATION

After showing the platform tips, allow the user to create content.

Ask for:

- What product/service/topic they want to promote

- Main message

- Optional promotion or special offer

- Additional information

Use the saved My Business information to provide business context where appropriate.

Allow the system to generate useful suggestions such as:

- Content idea

- Suggested caption

- Call to action

- Suggested hashtags where appropriate

- TikTok video concept/hook when TikTok is selected

The user must be able to:

- Edit the result

- Regenerate it

- Copy it

Do not automatically publish anything to social media.

The purpose is to HELP the owner create better content, not manage their social media accounts.

==================================================

3. CREATE POSTER

==================================================

Create Poster should allow a small-business owner to create an advertising poster without requiring professional design skills.

This should feel like a simple poster builder rather than a complicated graphic-design application.

POSTER DETAILS

Allow the business owner to enter:

- Business name

- Poster headline

- Product or service

- Description

- Price

- Special offer or promotion

- Contact details

- Business location

- Call to action

Allow optional fields so the user does not need to use everything.

IMAGE

Allow the business owner to upload a product/business image for the poster.

BRANDING

Use information from My Business where available:

- Business name

- Brand colour

- Contact details

- Location

Allow the user to change poster colours when needed.

TEMPLATES

Provide a small selection of professional poster templates.

Examples:

- Product Promotion

- Special Offer

- New Product

- Service Advertisement

- Business Announcement

Do not overwhelm the user with dozens of templates.

LIVE PREVIEW

Show a live poster preview while the business owner edits their information.

The preview should update when information changes.

The poster should visually contain appropriate information such as:

Business Name

SPECIAL OFFER

Product / Service

R199

Short description

Contact information

Call to action

POSTER ACTIONS

Allow the user to:

- Preview poster

- Edit poster

- Change template

- Change appropriate colours

- Download poster as an image

If actual image download/export cannot be implemented immediately, structure the feature properly for it rather than creating a fake button that claims to download something.

Do not create decorative buttons that do nothing.

==================================================

4. GOALS & TRACKING

==================================================

Create a simple business goal-management system.

The purpose is to help the business owner define measurable goals and manually track their progress.

CREATE GOAL

Allow the user to create a goal.

Ask for:

- Goal name

- Goal category

- Target value

- Current value

- Target date

Possible goal categories:

- Sales

- Revenue

- Customers

- Social Media Growth

- Orders

- Savings

- Custom Goal

Examples:

Monthly Sales

Target: R15,000

New Customers

Target: 20 customers

Instagram Followers

Target: 1,000 followers

Monthly Orders

Target: 50 orders

GOAL PROGRESS

Automatically calculate progress using:

Current Value / Target Value × 100

Display:

- Goal name

- Current value

- Target value

- Percentage complete

- Visual progress bar

- Target date

UPDATE GOAL

The business owner must be able to manually update progress.

For example:

Goal:

Monthly Sales

Target:

R15,000

Current:

R9,000

[Update Progress]

The user enters:

R11,500

The application should update:

R11,500 of R15,000

77%

and update the progress bar.

GOAL MANAGEMENT

Allow users to:

- Create goals

- Update progress

- Edit goals

- Mark goals as completed

- Delete goals

Completed goals should be visually distinguishable from active goals.

IMPORTANT DATA CONNECTION

Goals created on Goals & Tracking must automatically appear on the Dashboard.

Progress updated from the Dashboard must automatically update Goals & Tracking.

Progress updated from Goals & Tracking must automatically update the Dashboard.

Use one shared source of goal data.

==================================================

5. MY BUSINESS

==================================================

My Business should combine the business profile and relevant owner/account information so separate sidebar pages are not necessary.

Collect and allow editing of:

BUSINESS INFORMATION

- Business name

- Business category/type

- Business description

- Products/services offered

- Target audience

- Business location

- Business contact number

- Business email

OWNER INFORMATION

- Owner name

- Account email

BRANDING

Allow the business owner to select a preferred brand colour.

The selected brand colour should influence appropriate accent elements throughout the SmallBiz interface.

Examples:

- Primary buttons

- Active sidebar item

- Selected states

- Progress indicators

- Small highlights

IMPORTANT:

Do NOT change the entire interface to the selected colour.

Keep:

- Main backgrounds neutral

- Cards white

- Text dark and readable

- Borders subtle

The brand colour should act as an accent colour only.

LANGUAGE

Do NOT include:

- Preferred language

- Language settings

- Dashboard language switching

Remove language preferences completely from SmallBiz.

==================================================

ONBOARDING

==================================================

When a new business owner first creates an account, guide them through a short Business Setup process.

Ask for the essential information needed to personalise SmallBiz:

- Owner name

- Business name

- Business category

- Business description

- Products/services

- Target audience

- Location

- Contact information

- Preferred brand colour

Do not make onboarding unnecessarily long.

After completing setup, take the user to the Dashboard.

The information entered during onboarding must automatically populate My Business.

==================================================

DESIGN DIRECTION

==================================================

The application should look like a professional small-business productivity tool.

Use:

- Light neutral backgrounds

- White cards

- Subtle borders

- Minimal shadows

- Moderate corner radius

- Compact spacing

- Clear typography

- Simple professional icons

- Clear visual hierarchy

- Practical interface language

- Responsive layouts

The design should feel clean, calm and easy to understand.

AVOID:

- Huge headings

- Huge buttons

- Excessive rounded cards

- Heavy shadows

- Excessive gradients

- Decorative illustrations everywhere

- Overly colourful dashboards

- Marketing-style landing-page design inside the application

- Generic AI chatbot interfaces

- Unnecessary slogans

- Excessive animations

- Too many sidebar options

==================================================

RESPONSIVE DESIGN

==================================================

The application must work properly on:

- Desktop

- Tablet

- Mobile

Desktop:

Use the five-item sidebar navigation.

Tablet:

Adapt the layout appropriately.

Mobile:

Use a compact navigation pattern and stack content where necessary.

Forms, poster editing and goal updates must remain usable on smaller screens.

==================================================

FUNCTIONALITY AND DATA

==================================================

Build SmallBiz as a FUNCTIONAL application rather than only designing static screens.

Important user data should persist.

This includes:

- Business profile

- Brand colour

- Business goals

- Goal progress

- Generated content where appropriate

- Poster information where appropriate

Changes made in one part of the application must appear anywhere else that uses the same information.

For example:

If the business owner changes their business name in My Business, other relevant areas should use the updated name.

If they update a goal, the Dashboard should immediately reflect the updated progress.

Avoid hard-coded dashboard statistics pretending to represent real user activity.

==================================================

TECHNICAL / DEVELOPMENT REQUIREMENTS

==================================================

Keep the codebase organised, readable and maintainable.

Use reusable components where appropriate.

Keep application state consistent across pages.

Do not duplicate data unnecessarily.

Do not create fake functionality.

If a feature requires an external service that is not yet connected, clearly structure the application for future integration instead of pretending that the feature works.

Do not add features outside this scope without approval.

==================================================

FINAL PRODUCT DIRECTION

==================================================

SmallBiz should answer four simple questions for the business owner:

"What should I post?"

→ Create Content

"How can I advertise my business?"

→ Create Poster

"What am I trying to achieve?"

→ Goals & Tracking

"How am I progressing?"

→ Dashboard

The My Business section provides the business information needed to personalise these tools.

Keep SmallBiz focused on these needs.

The final sidebar must contain ONLY:

1. Dashboard

2. Create Content

3. Create Poster

4. Goals & Tracking

5. My Business

Build the first complete working version around this structure.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://biz-win-way.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3e6203fd-8991-4604-a7ba-f15639c98299).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
