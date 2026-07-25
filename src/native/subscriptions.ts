'use client'

import { Capacitor } from '@capacitor/core'

export type SubscriptionAccess = {
  native: boolean
  active: boolean
  configured: boolean
  priceLabel?: string
  packageIdentifier?: string
  message: string
}

const entitlementId = process.env.NEXT_PUBLIC_REVENUECAT_ENTITLEMENT_ID ?? 'seen_full_access'
let configured = false

async function configurePurchases() {
  if (!Capacitor.isNativePlatform()) return null

  const apiKey = process.env.NEXT_PUBLIC_REVENUECAT_IOS_API_KEY
  if (!apiKey) return null

  const { Purchases } = await import('@revenuecat/purchases-capacitor')
  if (!configured) {
    await Purchases.configure({ apiKey })
    configured = true
  }

  return Purchases
}

function hasAccess(customerInfo: Awaited<ReturnType<NonNullable<Awaited<ReturnType<typeof configurePurchases>>>['getCustomerInfo']>>['customerInfo']) {
  return Boolean(customerInfo.entitlements.active[entitlementId])
}

export async function readSubscriptionAccess(): Promise<SubscriptionAccess> {
  if (!Capacitor.isNativePlatform()) {
    return {
      native: false,
      active: false,
      configured: false,
      message: 'App Store subscription checkout opens inside the native iPhone build.',
    }
  }

  const Purchases = await configurePurchases()
  if (!Purchases) {
    return {
      native: true,
      active: false,
      configured: false,
      message: 'RevenueCat is ready for the public iOS API key and SEEN entitlement identifier.',
    }
  }

  const [{ customerInfo }, offerings] = await Promise.all([
    Purchases.getCustomerInfo(),
    Purchases.getOfferings(),
  ])
  const selectedPackage = offerings.current?.annual
    ?? offerings.current?.monthly
    ?? offerings.current?.availablePackages[0]

  return {
    native: true,
    active: hasAccess(customerInfo),
    configured: true,
    priceLabel: selectedPackage?.product.priceString,
    packageIdentifier: selectedPackage?.identifier,
    message: hasAccess(customerInfo)
      ? 'Full SEEN access is active.'
      : 'Choose the available App Store subscription to unlock the full SEEN path.',
  }
}

export async function purchaseSeenAccess(): Promise<SubscriptionAccess> {
  const Purchases = await configurePurchases()
  if (!Purchases) return readSubscriptionAccess()

  const offerings = await Purchases.getOfferings()
  const selectedPackage = offerings.current?.annual
    ?? offerings.current?.monthly
    ?? offerings.current?.availablePackages[0]

  if (!selectedPackage) {
    return {
      native: true,
      active: false,
      configured: true,
      message: 'No App Store subscription package is attached to the current RevenueCat offering.',
    }
  }

  const { customerInfo } = await Purchases.purchasePackage({ aPackage: selectedPackage })
  return {
    native: true,
    active: hasAccess(customerInfo),
    configured: true,
    priceLabel: selectedPackage.product.priceString,
    packageIdentifier: selectedPackage.identifier,
    message: hasAccess(customerInfo)
      ? 'Full SEEN access is active.'
      : 'The purchase completed without activating the configured SEEN entitlement.',
  }
}

export async function restoreSeenAccess(): Promise<SubscriptionAccess> {
  const Purchases = await configurePurchases()
  if (!Purchases) return readSubscriptionAccess()

  const { customerInfo } = await Purchases.restorePurchases()
  return {
    native: true,
    active: hasAccess(customerInfo),
    configured: true,
    message: hasAccess(customerInfo)
      ? 'Your SEEN access has been restored.'
      : 'No active SEEN subscription was found for this App Store account.',
  }
}
