# Hall Dining Management System

A modern web-based platform designed to streamline meal management for university hall students through a token-based system.

## 🚀 Features

### For Students
- **Token Purchase**: Buy meal tokens for 5, 7, 15, or 30 days
- **Flexible Meal Options**: Choose lunch-only or lunch+dinner packages
- **Smart Pricing**: Special rates for longer durations with mini feasts
- **Meal Cancellation**: Cancel meals 2+ days in advance for 90% refund
- **Balance Management**: Add credit through multiple payment methods
- **Comprehensive Billing**: Track spending, refunds, and transaction history

### For Managers
- **Dining Month Management**: Create and deploy 30-day dining periods
- **Cancellation Approval**: Review and approve student cancellation requests
- **Dashboard Analytics**: Monitor token sales, revenue, and system statistics
- **Student Management**: Oversee student accounts and balances

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Netlify

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hall-dining-system.git
cd hall-dining-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🔐 Demo Credentials

### Student Login
- **Email**: john.doe@university.edu
- **Password**: student123

### Manager Login
- **Email**: manager@university.edu
- **Password**: manager123

## 💰 Pricing Structure

- **Lunch Only**: ৳50/day (available for 5 or 7 days)
- **Lunch + Dinner**: ৳80/day (available for all durations)
- **Special 15-day Package**: ৳1,300 (includes mini feasts)
- **Special 30-day Package**: ৳2,500 (includes mini feasts)

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── TokenPurchase.tsx
│   ├── MealCancellation.tsx
│   ├── PaymentGateway.tsx
│   ├── Billing.tsx
│   ├── DiningMonthManager.tsx
│   └── CancellationApproval.tsx
├── contexts/           # React context providers
│   └── AppContext.tsx
├── types/             # TypeScript type definitions
│   └── index.ts
├── utils/             # Utility functions
│   ├── pricing.ts
│   └── dateUtils.ts
└── App.tsx           # Main application component
```

## 🚀 Deployment

The application is configured for easy deployment on Netlify:

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your preferred hosting service.

### Netlify Deployment
- Connect your GitHub repository to Netlify
- Set build command: `npm run build`
- Set publish directory: `dist`

## 🔄 Business Logic

### Token System
- Tokens are valid from purchase date for the selected duration
- Students can have multiple active tokens simultaneously
- Token validity is checked in real-time

### Cancellation Policy
- Cancellations must be requested at least 2 days in advance
- Approved cancellations receive 90% refund (10% processing fee)
- Refunds are automatically added to student balance

### Dining Month Management
- Only one active dining month at a time
- 30-day periods with day numbering (1-30)
- Automatic date calculations and validation

## 🎨 Design Features

- **Responsive Design**: Mobile-first approach with breakpoints
- **Modern UI**: Clean card-based layouts with subtle shadows
- **Interactive Elements**: Hover states and smooth transitions
- **Accessibility**: Proper contrast ratios and keyboard navigation
- **Professional Typography**: Consistent font hierarchy

## 🔮 Future Enhancements

- [ ] Real backend API integration
- [ ] Database persistence (MySQL/PostgreSQL)
- [ ] Email notifications for cancellations
- [ ] Advanced reporting and analytics
- [ ] Mobile app development
- [ ] Integration with university systems

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

Built with ❤️ for university hall dining management