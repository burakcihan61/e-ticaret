# Commit Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages.

## Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

## Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation
- **ci**: Changes to CI configuration files and scripts
- **build**: Changes that affect the build system or external dependencies
- **revert**: Reverts a previous commit

## Scopes

Use these scopes to indicate which part of the codebase is affected:

- **auth**: Authentication & authorization
- **product**: Product management
- **cart**: Shopping cart functionality
- **checkout**: Checkout process
- **payment**: Payment integration (Iyzico)
- **admin**: Admin dashboard
- **user**: User management
- **order**: Order management
- **coupon**: Coupon system
- **banner**: Banner management
- **category**: Category management
- **brand**: Brand management
- **review**: Product reviews
- **wishlist**: Wishlist functionality
- **ui**: UI components
- **api**: API routes
- **db**: Database & Prisma
- **config**: Configuration files
- **middleware**: Next.js middleware
- **types**: TypeScript types

## Subject

The subject contains a succinct description of the change:

- Use the imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No dot (.) at the end
- Maximum 72 characters

## Body (Optional)

The body should include the motivation for the change and contrast this with previous behavior.

- Use the imperative, present tense
- Wrap at 72 characters
- Explain what and why vs. how

## Footer (Optional)

The footer should contain:

- **Breaking Changes**: Start with `BREAKING CHANGE:` followed by a description
- **Issue References**: Reference GitHub issues that this commit closes (e.g., `Closes #123`)

## Examples

### Feature
```
feat(product): add product filtering by price range

Implement min/max price filters on product listing page.
Filters are applied via query parameters and work with pagination.

Closes #45
```

### Bug Fix
```
fix(cart): resolve quantity update issue on mobile devices

The cart quantity input was not properly handling touch events
on mobile devices. Updated event handlers to support both
click and touch interactions.
```

### Documentation
```
docs(readme): update installation instructions

Add detailed steps for setting up Prisma Postgres
and configuring environment variables.
```

### Refactoring
```
refactor(auth): simplify JWT token validation logic

Extract token validation into a separate utility function
to improve code reusability and testability.
```

### Performance
```
perf(product): optimize product list query

Add database indexes on frequently queried fields
and implement query result caching to reduce load times.
```

### Breaking Change
```
feat(api): change product API response structure

BREAKING CHANGE: Product API now returns nested category
object instead of categoryId. Update client code to use
product.category.id instead of product.categoryId.
```

### Chore
```
chore(deps): update dependencies to latest versions

Update Next.js to 15.1.0, Prisma to 7.2.0, and other
dependencies to their latest stable versions.
```

### Multiple Scopes
```
feat(cart,checkout): add express checkout option

Allow users to skip cart page and go directly to checkout
from product detail page.
```

## Commit Message Template

You can set up a commit message template in Git:

1. Create a file `.gitmessage` in your home directory:
```
# <type>(<scope>): <subject>
# |<----  Using a Maximum Of 72 Characters  ---->|

# Explain why this change is being made
# |<----   Try To Limit Each Line to a Maximum Of 72 Characters   ---->|

# Provide links or keys to any relevant tickets, articles or other resources
# Example: Closes #23

# --- COMMIT END ---
# Type can be
#    feat     (new feature)
#    fix      (bug fix)
#    refactor (refactoring code)
#    style    (formatting, missing semi colons, etc; no code change)
#    docs     (changes to documentation)
#    test     (adding or refactoring tests; no production code change)
#    chore    (updating build tasks, package manager configs, etc; no production code change)
#    perf     (performance improvements)
#    ci       (CI/CD changes)
#    build    (build system changes)
#    revert   (revert a previous commit)
# --------------------
# Remember to
#   - Use the imperative mood in the subject line
#   - Do not end the subject line with a period
#   - Separate subject from body with a blank line
#   - Use the body to explain what and why vs. how
#   - Can use multiple lines with "-" for bullet points in body
# --------------------
```

2. Configure Git to use this template:
```bash
git config --global commit.template ~/.gitmessage
```

## Tools

Consider using these tools to enforce commit conventions:

- **commitlint**: Lint commit messages
- **husky**: Git hooks to run commitlint before commit
- **commitizen**: Interactive commit message builder

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
