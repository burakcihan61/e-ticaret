# Next.js E-Commerce Platform

Modern, full-featured e-commerce platform built with Next.js 16, Prisma 7, and TypeScript. Features include product management, shopping cart, checkout with Iyzico payment integration, user authentication, and a comprehensive admin dashboard.

## ✨ Features

### 🛍️ Customer Features
- **Product Browsing**: Browse products by categories with filtering and sorting
- **Shopping Cart**: Add/remove items, update quantities with persistent storage
- **Wishlist**: Save favorite products for later
- **User Authentication**: Secure JWT-based authentication with role-based access
- **Checkout Process**: Multi-step checkout with address management
- **Payment Integration**: Iyzico payment gateway integration
- **Order Management**: View order history and track order status
- **Product Reviews**: Rate and review purchased products
- **Coupon System**: Apply discount coupons at checkout
- **Responsive Design**: Mobile-first design with dark mode support

### 🔧 Admin Features
- **Dashboard**: Overview of sales, orders, and key metrics
- **Product Management**: CRUD operations for products with image upload
- **Category Management**: Organize products into categories
- **Brand Management**: Manage product brands
- **Order Management**: Process and update order statuses
- **User Management**: View and manage customer accounts
- **Coupon Management**: Create and manage discount coupons
- **Banner Management**: Control homepage banners and promotions
- **Settings**: Configure shipping zones, tax rates, and maintenance mode

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Prisma 7](https://www.prisma.io/) with PostgreSQL (Prisma Postgres)
- **Authentication**: JWT with HTTP-only cookies
- **Payment**: [Iyzico](https://www.iyzico.com/) payment gateway
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Code Quality**: ESLint, Prettier

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- PostgreSQL database (or Prisma Postgres account)
- Iyzico merchant account (for payment integration)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd next-js-prisma
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and fill in your values:
   ```env
   DATABASE_URL=your_prisma_postgres_connection_string
   JWT_SECRET=your_secure_random_secret
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   IYZICO_API_KEY=your_iyzico_api_key
   IYZICO_SECRET_KEY=your_iyzico_secret_key
   IYZICO_BASE_URL=https://sandbox-api.iyzipay.com
   ```

4. **Set up the database**
   ```bash
   # Push schema to database
   npm run db:push
   
   # Seed initial data
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run typecheck` - Run TypeScript type checking
- `npm run format:write` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run db:test` - Test database connection
- `npm run db:studio` - Open Prisma Studio
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with initial data

## 🗂️ Project Structure

```
next-js-prisma/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication pages
│   ├── (shop)/              # Customer-facing pages
│   ├── admin/               # Admin dashboard
│   └── api/                 # API routes
├── components/              # React components
│   ├── ui/                  # Base UI components (shadcn/ui)
│   ├── admin/               # Admin-specific components
│   ├── auth/                # Authentication components
│   ├── cart/                # Shopping cart components
│   ├── checkout/            # Checkout components
│   ├── layout/              # Layout components
│   ├── product/             # Product components
│   └── shop/                # Shop components
├── lib/                     # Utility functions
│   ├── auth.ts              # Authentication utilities
│   ├── iyzico.ts            # Payment integration
│   ├── prisma.ts            # Prisma client
│   └── utils.ts             # General utilities
├── prisma/                  # Database schema and migrations
│   ├── schema.prisma        # Prisma schema
│   └── seed.ts              # Database seeding
├── public/                  # Static assets
├── store/                   # Zustand stores
├── types/                   # TypeScript type definitions
└── middleware.ts            # Next.js middleware
```

## 🔐 Default Admin Account

After seeding the database, you can login with:
- **Email**: admin@example.com
- **Password**: admin123456
- **Role**: SUPER_ADMIN

## 🎨 Features in Detail

### Authentication & Authorization
- JWT-based authentication with HTTP-only cookies
- Role-based access control (CUSTOMER, ADMIN, SUPER_ADMIN)
- Protected routes with middleware
- Session management

### Product Management
- Product variants (size, color)
- Multiple product images
- Stock tracking
- Featured and new product badges
- SEO-friendly URLs with slugs

### Shopping Experience
- Real-time cart updates
- Persistent cart with localStorage
- Wishlist functionality
- Product search and filtering
- Category-based navigation

### Payment Processing
- Iyzico payment gateway integration
- Secure payment flow
- Order confirmation emails
- Payment status tracking

### Admin Dashboard
- Sales analytics
- Order processing
- Inventory management
- Customer management
- Coupon creation and management

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) for clear and structured commit messages.

#### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without changing functionality
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates
- `ci`: CI/CD configuration changes
- `build`: Build system or external dependency changes
- `revert`: Revert a previous commit

#### Scopes
- `auth`: Authentication & authorization
- `product`: Product management
- `cart`: Shopping cart
- `checkout`: Checkout process
- `payment`: Payment integration
- `admin`: Admin dashboard
- `user`: User management
- `order`: Order management
- `coupon`: Coupon system
- `ui`: UI components
- `api`: API routes
- `db`: Database & Prisma
- `config`: Configuration files

#### Examples
```bash
feat(product): add product filtering by price range

fix(cart): resolve quantity update issue on mobile

docs(readme): update installation instructions

refactor(auth): simplify JWT token validation logic

perf(product): optimize product list query with pagination

chore(deps): update dependencies to latest versions
```

#### Breaking Changes
For breaking changes, add `BREAKING CHANGE:` in the footer:
```bash
feat(api): change product API response structure

BREAKING CHANGE: Product API now returns nested category object instead of categoryId
```

### Pull Request Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes following the convention above
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For support, please open an issue in the GitHub repository.

---

Made with ❤️ using Next.js and Prisma
