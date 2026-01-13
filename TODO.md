# TODO: Fix Database Sync Error and Prevent Data Loss

## Issue
- Initial Error: Cannot drop table 'comments' referenced by a foreign key constraint 'likes_ibfk_3' on table 'likes'.
- The 'likes' and 'ratings' tables have foreign keys referencing the 'comments' table.
- Additional Issue: On server restart, comments, likes, and ratings tables were being dropped and recreated, causing data loss.

## Solution
- Modified `backend/DB/dbConnect.js` to drop dependent tables ('likes' and 'ratings') before dropping the 'comments' table if needed.
- Commented out the force recreation of comments table to prevent data loss on restarts.

## Tasks
- [x] Identify the foreign key dependencies (likes and ratings reference comments).
- [x] Update dbConnect.js to drop 'likes' table before 'comments'.
- [x] Update dbConnect.js to drop 'ratings' table before 'comments'.
- [x] Comment out force recreation of comments table to prevent data loss.
- [ ] Test the database sync by running the server.
- [ ] Verify that tables persist across restarts without data loss.

## Next Steps
- Run the backend server to test the fix.
- Check logs for successful connection without table recreation.
- If schema issues arise in the future, the commented code can be used as a reference.
