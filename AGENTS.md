# AGENTS.md

## Must-follow constraints

- **Offline-first architecture**: AsyncStorage is the source of truth. Server backend is NOT functional yet. Do not add API calls or assume server integration works.
- **Date handling is fragile**: All Date objects MUST be serialized to ISO strings before AsyncStorage, then deserialized on load. Pattern is in `StorageUtils.saveTransactions()` and `StorageUtils.loadTransactions()`. Breaking this corrupts all stored transactions.
- **React Native environment**: Client runs on Expo/React Native. No web APIs (localStorage, fetch with CORS, DOM). Use React Native equivalents.
- **Mixed .js/.ts**: Client source mixes JavaScript and TypeScript. Match file extension when editing. TypeScript files use `.tsx` for components.
- **Transaction ID collision risk**: IDs use `Date.now().toString()`. Batch operations or rapid creates will collide. Do not create multiple transactions in loops without delay or better ID generation.

## Validation before finishing

- Run `cd client && npm start` and verify Expo starts without errors
- Test transaction create/edit/delete flow in app if data logic was changed
- Check that AsyncStorage operations preserve date serialization

## Repo-specific conventions

- **Monorepo**: `client/` and `server/` are independent. Install deps separately in each.
- **State management**: Zustand store in `client/src/store/transaction.store.js`. All async storage operations go through store methods, not direct imports.
- **Category system**: Categories defined in `client/src/constants/category.constant.js`. Do not add categories without updating this file.
- **Color constants**: Centralized in `client/src/constants/colors.js`. Use these, don't add inline color values.

## Important locations

- Transaction storage logic: `client/src/constants/storage.utils.js`
- State management: `client/src/store/transaction.store.js`
- Data model: See transaction shape in `transaction.store.js` addTransaction method

## Change safety rules

- **Never modify StorageUtils date serialization logic** unless explicitly requested. This will corrupt existing user data.
- **Preserve backward compatibility** for stored transaction format. Users have local data that must remain readable.
- **Do not integrate server API** until explicitly requested. Backend is incomplete (has mongoose dep but PLANNING.md says Supabase - inconsistent and not implemented).

## Known gotchas

- `Date.now()` for IDs means rapid creates will collide. If adding batch import or automated transaction creation, switch to UUID or add collision handling.
- Server package.json has mongoose but PLANNING.md specifies Supabase/PostgreSQL. Backend is not production-ready and architecture is undecided.
- AsyncStorage has no schema validation. Malformed saves will silently corrupt data on next load.
- Client has `tsconfig.json` with `"strict": true` but many files are `.js`. New components should be `.tsx` unless matching existing patterns in same directory.