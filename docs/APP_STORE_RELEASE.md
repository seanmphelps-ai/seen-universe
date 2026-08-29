# SEEN App Store Release Contract

## Production Target

SEEN ships from one Next.js application as:

- an installable mobile-first PWA
- a Capacitor iOS application
- an App Store subscription product
- a native lock-screen notification experience

## Repository Build

```bash
npm install
npm run typecheck
npm run build
npm run ios:add
npm run ios:open
```

After the iOS project exists, every web application update runs:

```bash
npm run ios:sync
```

## App Store Identity

- Bundle identifier: `ai.seanmphelps.seen`
- App name: `SEEN`
- RevenueCat entitlement: `seen_full_access`
- Web asset directory: `out`

## RevenueCat Configuration

1. Create the SEEN iOS app in RevenueCat.
2. Connect the App Store Connect shared secret and StoreKit configuration.
3. Create the `seen_full_access` entitlement.
4. Attach monthly and annual auto-renewable subscription products to the current offering.
5. Add the public iOS SDK key as `NEXT_PUBLIC_REVENUECAT_IOS_API_KEY`.
6. Preserve `NEXT_PUBLIC_REVENUECAT_ENTITLEMENT_ID=seen_full_access`.

The application reads the active entitlement, purchases the current annual or monthly package, and restores prior App Store purchases.

## iOS Capabilities

Enable these capabilities on the SEEN target in Xcode:

- In-App Purchase
- Push Notifications
- Background Modes → Remote notifications

Add the APNs registration callbacks required by Capacitor to `AppDelegate.swift`.

## Lock-Screen Delivery

The installed iPhone application provides two notification paths:

- Local Cadence schedules the user’s chosen daily time directly on device.
- Remote Cadence registers the APNs device token and sends it to `NEXT_PUBLIC_PUSH_REGISTRATION_URL`.

The remote registration service stores device tokens by authenticated SEEN user and sends APNs payloads from the server. APNs signing keys and Apple credentials remain in the deployment secret store.

## App Review Surface

The subscription screen communicates:

- the content and functionality unlocked
- the active App Store price returned by StoreKit
- restore-purchase access
- optional notification consent

SEEN provides the first foundation recognition before the paywall and reserves deeper environmental profiles, recognition paths, and Cadence continuity for the active subscription.

## Verification Gates

- `npm run typecheck` passes.
- `npm run build` exports the PWA to `out`.
- `npx cap sync ios` loads all native plugins.
- Foundation intake persists across refresh and relaunch.
- The first recognition contains only structural claims supported by submitted data.
- StoreKit sandbox purchase activates `seen_full_access`.
- Restore purchase reactivates the same entitlement.
- Local Cadence appears on the iPhone lock screen at the selected time.
- APNs registration reaches the configured token endpoint.
- The complete path works at 390–430 px mobile widths.
