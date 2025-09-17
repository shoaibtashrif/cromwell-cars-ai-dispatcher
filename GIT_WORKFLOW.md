# 🔀 Git Workflow Guide - Cromwell Cars AI Dispatcher

## 📋 Branch Naming Convention

### **Branch Types:**
- **`fix/`** - Bug fixes and error corrections
- **`feature/`** - New features and enhancements  
- **`hotfix/`** - Critical production fixes
- **`docs/`** - Documentation updates
- **`refactor/`** - Code refactoring without feature changes

### **Branch Naming Examples:**
```bash
fix/booking-api-validation-error
fix/phone-number-format-issue
feature/driver-location-tracking
feature/sms-notifications
hotfix/critical-payment-bug
docs/api-documentation-update
refactor/cromwell-api-structure
```

## 🚀 Workflow Process

### **1. Create Feature/Fix Branch**
```bash
# For new features
git checkout -b feature/feature-name
git push -u origin feature/feature-name

# For bug fixes  
git checkout -b fix/bug-description
git push -u origin fix/bug-description

# For hotfixes
git checkout -b hotfix/critical-issue
git push -u origin hotfix/critical-issue
```

### **2. Work on Your Changes**
```bash
# Make your changes
git add .
git commit -m "descriptive commit message"
git push origin branch-name
```

### **3. Create Pull Request**
```bash
# Create PR using GitHub CLI
gh pr create --title "Fix: Booking API validation errors" \
  --body "Fixes vehicle type mapping and phone number issues" \
  --base master

# OR create PR through GitHub web interface
# https://github.com/username/repo/compare/master...branch-name
```

### **4. Review and Merge**
```bash
# After PR approval, merge via GitHub
# Then clean up local branches
git checkout master
git pull origin master
git branch -d fix/branch-name
```

## 📁 Current Repository Structure

```
master (main branch)
├── Production-ready code
├── All tested features
└── Stable releases

feature/* branches
├── feature/new-functionality
├── feature/enhanced-ui
└── feature/api-integrations

fix/* branches  
├── fix/booking-validation
├── fix/phone-format
└── fix/error-handling
```

## 🔧 Commands Reference

### **Branch Management**
```bash
# List all branches
git branch -a

# Create and switch to new branch
git checkout -b fix/issue-name

# Switch between branches
git checkout master
git checkout fix/issue-name

# Delete branch (local)
git branch -d branch-name

# Delete branch (remote)  
git push origin --delete branch-name
```

### **Pull Request Commands**
```bash
# Create PR with GitHub CLI
gh pr create --title "Title" --body "Description"

# List PRs
gh pr list

# Check out PR locally
gh pr checkout 123

# Merge PR
gh pr merge 123 --merge
```

### **Sync with Remote**
```bash
# Fetch latest changes
git fetch origin

# Update master branch
git checkout master
git pull origin master

# Rebase feature branch on latest master
git checkout feature/branch-name
git rebase master
```

## 📋 Example: Creating a Fix Branch

### **Scenario: Fixing a booking issue**

```bash
# 1. Start from master
git checkout master
git pull origin master

# 2. Create fix branch
git checkout -b fix/booking-phone-validation

# 3. Make changes to routes/cromwell.js
# ... edit files ...

# 4. Commit changes
git add routes/cromwell.js
git commit -m "fix: correct phone number validation in booking API

- Use actual phone numbers instead of placeholder
- Add proper phone format validation
- Fix booking payload structure for Cabee API"

# 5. Push branch
git push -u origin fix/booking-phone-validation

# 6. Create Pull Request
gh pr create \
  --title "Fix: Booking phone validation errors" \
  --body "Resolves issues with phone number handling in booking API calls"

# 7. After PR merge, cleanup
git checkout master
git pull origin master
git branch -d fix/booking-phone-validation
```

## 🎯 Best Practices

### **Commit Messages**
```bash
# Good commit messages:
fix: resolve booking API validation errors
feature: add driver location tracking
docs: update API documentation
refactor: simplify booking payload structure

# Bad commit messages:
fix stuff
update code
changes
bug fix
```

### **Pull Request Guidelines**
- **Clear Title**: Describe what the PR does
- **Detailed Description**: Explain the problem and solution
- **Link Issues**: Reference related GitHub issues
- **Test Instructions**: How to test the changes
- **Screenshots**: For UI changes

### **Branch Lifecycle**
1. **Create** branch from master
2. **Develop** feature/fix
3. **Test** thoroughly
4. **Create** Pull Request
5. **Review** and address feedback
6. **Merge** to master
7. **Delete** branch

## 🚀 Quick Commands

```bash
# Create fix branch for booking issue
git checkout -b fix/booking-vehicle-type-mapping

# Create feature branch for new functionality  
git checkout -b feature/sms-notifications

# Create hotfix for critical issue
git checkout -b hotfix/payment-gateway-down

# Push and create PR in one go
git push -u origin fix/branch-name && \
gh pr create --title "Fix: Description" --body "Details"
```

---

**🎯 Always work in branches and create PRs for better code review and tracking!** 