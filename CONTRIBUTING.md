<div align="center">

# 🤝 Contributing to PlayNxt

### Thank you for helping make PlayNxt better!

We welcome all contributions — from bug fixes to new features. 
This guide will help you get started.

</div>

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Workflow](#-development-workflow)
- [Commit Guidelines](#-commit-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Style Guide](#-style-guide)
- [Need Help?](#-need-help)

---

## 💎 Code of Conduct

We're committed to providing a welcoming and inclusive environment. Please:

- 🤝 **Be respectful** — Treat everyone with kindness
- 💬 **Be constructive** — Focus on improving, not criticizing
- 🌍 **Be inclusive** — Welcome diverse perspectives
- 🎯 **Be focused** — Keep discussions on topic

---

## 🚀 Getting Started

### 1️⃣ Fork & Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/playnxt.git
cd playnxt/PlayNxt
```

### 2️⃣ Set Up Development Environment

```bash
# Install dependencies
npm install
cd backend && npm install

# Set up environment variables
cp backend/.env.example backend/.env
# Edit .env with your values

# Generate Prisma client
cd backend && npx prisma generate
```

### 3️⃣ Run the App

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
npm start
```

---

## 🔄 Development Workflow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Create    │ →  │    Make     │ →  │   Submit    │
│   Branch    │    │   Changes   │    │     PR      │
└─────────────┘    └─────────────┘    └─────────────┘
```

### Branch Naming

| Type | Pattern | Example |
|:----:|:-------:|:-------:|
| ✨ Feature | `feature/description` | `feature/add-filters` |
| 🐛 Bug Fix | `fix/description` | `fix/login-crash` |
| 📚 Docs | `docs/description` | `docs/api-guide` |
| 🎨 Style | `style/description` | `style/button-redesign` |

---

## 📝 Commit Guidelines

We follow **Conventional Commits**. Format:

```
<type>: <description>

[optional body]
[optional footer]
```

### Types

| Emoji | Type | Description |
|:-----:|:----:|:------------|
| ✨ | `feat` | New feature |
| 🐛 | `fix` | Bug fix |
| 📚 | `docs` | Documentation |
| 🎨 | `style` | Formatting, no code change |
| ♻️ | `refactor` | Code restructure |
| 🧪 | `test` | Adding tests |
| 🔧 | `chore` | Maintenance tasks |

### Examples

```bash
✨ feat: add venue search by location
🐛 fix: resolve booking date picker crash
📚 docs: update API endpoints in README
♻️ refactor: simplify auth context logic
```

---

## 🔀 Pull Request Process

### Before Submitting

- [ ] ✅ Code compiles without errors
- [ ] 🧪 Tests pass (if applicable)
- [ ] 📱 Tested on iOS and/or Android
- [ ] 📝 Updated documentation (if needed)
- [ ] 🎨 Follows style guide

### PR Template

```markdown
## What does this PR do?

Brief description of changes

## Type of Change

- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 💥 Breaking change
- [ ] 📚 Documentation

## Screenshots (if applicable)

Add screenshots here

## Checklist

- [ ] Code compiles
- [ ] Tests pass
- [ ] Self-reviewed
```

---

## 🎨 Style Guide

### JavaScript/React Native

```javascript
// ✅ Use const/let, not var
const greeting = 'Hello';
let count = 0;

// ✅ Use async/await
const fetchData = async () => {
  const response = await api.get('/venues');
  return response.data;
};

// ✅ Use meaningful names
const calculateTotalPrice = (basePrice, hours) => {
  return basePrice * hours;
};

// ✅ Component structure
export default function VenueCard({ venue, onPress }) {
  // Hooks first
  const [loading, setLoading] = useState(false);
  
  // Handlers
  const handlePress = () => {
    onPress(venue.id);
  };
  
  // Render
  return (
    <TouchableOpacity onPress={handlePress}>
      {/* ... */}
    </TouchableOpacity>
  );
}
```

### File Organization

```
src/
├── components/
│   └── VenueCard.js       # PascalCase for components
├── services/
│   └── api.js             # camelCase for utilities
├── context/
│   └── AuthContext.js     # PascalCase for context
└── screens/
    └── HomeScreen.js      # PascalCase + Screen suffix
```

### CSS/Styles

```javascript
// ✅ Use StyleSheet.create
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.base,
  },
  // Group related styles
  headerTitle: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.bold,
  },
});
```

---

## 📌 Issue Labels

| Label | Description |
|:-----:|:------------|
| `🐛 bug` | Something isn't working |
| `✨ enhancement` | New feature request |
| `📚 documentation` | Docs improvement |
| `🟢 good first issue` | Great for beginners |
| `🆘 help wanted` | Extra attention needed |
| `⚡ priority` | High priority |

---

## 💬 Need Help?

- 📖 Check existing [issues](https://github.com/CodyBrat/PlayNxt/issues)
- 💬 Start a [discussion](https://github.com/CodyBrat/PlayNxt/discussions)
- 📧 Email: priyabrata@playnxt.com

---

<div align="center">

### 🌟 Every contribution counts!

Whether it's fixing a typo or adding a major feature, 
your contribution helps make PlayNxt better for everyone.

**Happy Coding! 🚀**

</div>
