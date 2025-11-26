# 🔐 SecureVault - Personal Password Manager

A modern, secure password manager with **Clerk Authentication**, **AES-256 Encryption**, and **Multi-user Support**.

## ✨ Features

- 🔐 **Clerk Authentication** - Secure, passwordless login
- 🔒 **AES-256 Encryption** - Military-grade password encryption
- 👤 **Multi-user Support** - Each user has their own secure vault
- ☁️ **Cloud Synced** - MongoDB database storage
- 🎨 **Modern UI** - Beautiful, responsive interface
- ✏️ **Full CRUD** - Add, view, edit, and delete passwords
- 🔑 **Password Generator** - Create strong, random passwords
- 📋 **Copy to Clipboard** - One-click password copying

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Clerk Authentication

1. **Create a Clerk Account**
   - Go to [https://dashboard.clerk.com/](https://dashboard.clerk.com/)
   - Sign up for a free account
   - Create a new application

2. **Get Your API Keys**
   - In Clerk Dashboard, go to **API Keys**
   - Copy your **Publishable Key** and **Secret Key**

3. **Configure Environment Variables**
   
   Update your `.env` file:
   ```env
   URL=your_mongodb_connection_string
   ENCRYPTION_KEY=your_64_character_hex_key
   CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
   CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
   ```

4. **Update Frontend Clerk Configuration**
   
   Edit `public/login.html` and `public/dashboard.html`:
   
   Replace:
   ```javascript
   const CLERK_PUBLISHABLE_KEY = 'YOUR_CLERK_PUBLISHABLE_KEY';
   ```
   
   With your actual publishable key:
   ```javascript
   const CLERK_PUBLISHABLE_KEY = 'pk_test_xxxxxxxxxxxxx';
   ```
   
   Also update the Clerk script src in both files:
   ```html
   <script
       async
       crossorigin="anonymous"
       data-clerk-publishable-key="pk_test_xxxxxxxxxxxxx"
       src="https://[your-frontend-api].clerk.accounts.dev/npm/@clerk/clerk-js@latest/dist/clerk.browser.js"
       type="text/javascript"
   ></script>
   ```

5. **Configure Clerk Application Settings**
   - In Clerk Dashboard, go to **Settings** → **Authentication**
   - Enable **Email/Password** authentication
   - Set redirect URLs:
     - Sign-in redirect: `http://localhost:3000/dashboard.html`
     - Sign-out redirect: `http://localhost:3000/login.html`

### 3. Start the Application

```bash
npm start
```

The app will run on `http://localhost:3000`

## 📖 How to Use

1. **Sign Up / Login**
   - Visit `http://localhost:3000`
   - You'll be redirected to the login page
   - Sign up with your email or use OAuth providers

2. **Add Passwords**
   - Click **Add Password** tab
   - Enter website name, username, and password
   - Click **Add Password**

3. **View Passwords**
   - All your passwords are listed in the **List Passwords** tab
   - Click **👁️ View** to see and copy the password

4. **Edit Passwords**
   - Click **✏️ Edit** on any password
   - Enter old password and new password
   - Password history prevents reuse

5. **Delete Passwords**
   - Click **🗑️ Delete** to remove a password

6. **Generate Secure Passwords**
   - Go to **Generate Password** tab
   - Set length and character options
   - Click **Generate Password**
   - Copy to clipboard

## 🔒 Security Features

- **AES-256 Encryption**: All passwords encrypted before storage
- **Clerk Authentication**: Industry-standard OAuth/OIDC
- **User Isolation**: Each user can only access their own passwords
- **Password History**: Prevents password reuse
- **Secure Sessions**: JWT-based authentication

## 📁 Project Structure

```
Password-Manager/
├── config/
│   └── modelConfig.js          # MongoDB configuration
├── controllers/
│   └── passwordController.js   # Password CRUD operations
├── middleware/
│   └── authMiddleware.js       # Clerk authentication middleware
├── models/
│   └── passwordModel.js        # Password schema (with userId)
├── public/
│   ├── index.html              # Redirect to login
│   ├── login.html              # Login page with Clerk
│   └── dashboard.html          # Main password manager UI
├── routes/
│   ├── mainRoutes.js           # API routes
│   └── passwordRoutes.js       # Password endpoints (protected)
├── utils/
│   ├── encryption.js           # AES-256 encryption utility
│   └── logger.js               # Winston logger
├── .env                        # Environment variables
├── index.js                    # Express server
└── package.json                # Dependencies
```

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk (@clerk/express)
- **Encryption**: Node.js Crypto (AES-256-CBC)
- **Frontend**: Vanilla HTML/CSS/JavaScript with Clerk JS

## 📝 API Endpoints

All endpoints require Clerk authentication:

- `POST /passwords/addPassword` - Add new password
- `GET /passwords/listPasswords` - List all user's passwords
- `POST /passwords/editPassword/:id` - Update password
- `DELETE /passwords/removePassword/:id` - Delete password
- `POST /passwords/passwordDetails/:id` - View password (decrypted)
- `POST /passwords/passwordGenerator` - Generate random password

## 🤝 Contributing

Feel free to contribute to this project! Create issues or pull requests.

## 📄 License

ISC

## 👨‍💻 Author

Built with ❤️ by the development team

---

**Note**: Never share your `.env` file or encryption keys!
