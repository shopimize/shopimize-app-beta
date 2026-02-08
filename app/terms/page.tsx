export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-purple max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-700">
                By accessing or using Shopimize ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
                If you disagree with any part of these terms, you may not access the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                Shopimize provides profit analytics and business intelligence tools for e-commerce businesses. Our Service:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Connects to your e-commerce platforms (Shopify, WooCommerce, etc.)</li>
                <li>Aggregates sales, cost, and advertising data</li>
                <li>Calculates profit margins and provides analytics</li>
                <li>Offers insights to optimize your business performance</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Account Registration</h2>
              <p className="text-gray-700 mb-4">To use the Service, you must:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Be at least 18 years old</li>
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Subscription Plans and Billing</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.1 Subscription Tiers</h3>
              <p className="text-gray-700 mb-4">We offer multiple subscription plans with different features and order limits:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Free:</strong> Limited features, up to 50 orders/month</li>
                <li><strong>Starter:</strong> $29/month, up to 500 orders/month</li>
                <li><strong>Professional:</strong> $79/month, up to 2,500 orders/month</li>
                <li><strong>Enterprise:</strong> $299/month, up to 10,000 orders/month</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.2 Order Overages</h3>
              <p className="text-gray-700">
                If your monthly order volume exceeds your plan's limit, you will be charged per additional order according 
                to your plan's overage rate. You will be notified when approaching your limit.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.3 Payment</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Subscription fees are billed monthly in advance</li>
                <li>Payment is processed through Stripe</li>
                <li>All fees are non-refundable except as required by law</li>
                <li>We reserve the right to change pricing with 30 days notice</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.4 Cancellation</h3>
              <p className="text-gray-700">
                You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period. 
                You will retain access until the end of that period.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Acceptable Use</h2>
              <p className="text-gray-700 mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Violate any laws or regulations</li>
                <li>Infringe upon intellectual property rights</li>
                <li>Transmit malware, viruses, or harmful code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Reverse engineer, decompile, or disassemble the Service</li>
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Scrape, mine, or harvest data from the Service</li>
                <li>Resell or redistribute the Service without permission</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data and Privacy</h2>
              <p className="text-gray-700 mb-4">
                Your use of the Service is also governed by our Privacy Policy. By using the Service, you consent to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Our collection and use of your data as described in our Privacy Policy</li>
                <li>Granting us access to your connected e-commerce platforms</li>
                <li>Our processing of your business data to provide analytics</li>
              </ul>
              <p className="text-gray-700 mt-4">
                <strong>You retain all ownership rights to your data.</strong> We do not claim any ownership of your content or business data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                The Service and its original content, features, and functionality are owned by Shopimize and are protected by:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Copyright laws</li>
                <li>Trademark laws</li>
                <li>Other intellectual property rights</li>
              </ul>
              <p className="text-gray-700 mt-4">
                You may not copy, modify, distribute, sell, or lease any part of our Service without explicit written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                The Service integrates with third-party platforms (Shopify, WooCommerce, Google Ads, etc.). You acknowledge that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>We are not responsible for the availability or functionality of third-party services</li>
                <li>Third-party services have their own terms and privacy policies</li>
                <li>We may terminate integrations if third-party APIs change or become unavailable</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Service Availability</h2>
              <p className="text-gray-700 mb-4">
                We strive for 99.9% uptime but do not guarantee uninterrupted access. We may:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Temporarily suspend the Service for maintenance</li>
                <li>Modify or discontinue features with notice</li>
                <li>Limit access during periods of high demand</li>
              </ul>
              <p className="text-gray-700 mt-4">
                We are not liable for any losses resulting from service interruptions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Disclaimers</h2>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-gray-700 font-semibold mb-2">THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.</p>
                <p className="text-gray-700">
                  We do not guarantee that:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 mt-2">
                  <li>The Service will be error-free or uninterrupted</li>
                  <li>Defects will be corrected</li>
                  <li>The Service is free of viruses or harmful components</li>
                  <li>Results from using the Service will be accurate or reliable</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Limitation of Liability</h2>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-gray-700 font-semibold mb-2">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
                <p className="text-gray-700">
                  Shopimize shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                  including loss of profits, data, or business opportunities, arising from:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 mt-2">
                  <li>Your use or inability to use the Service</li>
                  <li>Unauthorized access to your data</li>
                  <li>Third-party conduct or content</li>
                  <li>Any other matter relating to the Service</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  <strong>Our total liability shall not exceed the amount you paid us in the past 12 months.</strong>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Indemnification</h2>
              <p className="text-gray-700">
                You agree to indemnify and hold harmless Shopimize from any claims, damages, losses, liabilities, and expenses 
                arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account immediately, without prior notice, for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Violation of these Terms</li>
                <li>Non-payment of fees</li>
                <li>Fraudulent or illegal activity</li>
                <li>At our sole discretion for any reason</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Upon termination, your right to use the Service will immediately cease. You may export your data 
                within 30 days of termination.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Governing Law</h2>
              <p className="text-gray-700">
                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], 
                without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                Any disputes arising from these Terms or the Service shall be resolved through:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Good faith negotiation between the parties</li>
                <li>If unresolved, binding arbitration in [Your Jurisdiction]</li>
                <li>Each party bears their own costs unless otherwise awarded</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these Terms at any time. We will notify you of material changes via email 
                or prominent notice in the Service. Continued use after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">17. Contact Us</h2>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  For questions about these Terms, contact us at:<br/>
                  <strong>Email:</strong> legal@shopimize.com<br/>
                  <strong>Address:</strong> [Your Company Address]
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
