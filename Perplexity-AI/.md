- Authentication system
- Chat with AI
- Chat History
- Message Storage
- Ai with internet research capabilities


Data Modeling of this Application:
1. User Model: _id, username, email, password, createdAt, updatedAt
2. Message Model: _id, chat, messageContent, role:[user, ai],
3. Chat Model: _id, user, messages (array of Message Model), createdAt, updatedAt