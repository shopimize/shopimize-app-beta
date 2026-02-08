export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-purple max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Shopimize ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our profit analytics platform.
              </p>
              <p className="text-gray-700">
                This policy complies with the EU General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Data Controller</h2>
              <p className="text-gray-700">
                For the purposes of GDPR, the data controller is:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                <p className="text-gray-700 font-mono text-sm">
                  Shopimize<br/>
                  Email: privacy@shopimize.com<br/>
                  Address: [Your Company Address]
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.1 Personal Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Account Data:</strong> Name, email address, password (hashed)</li>
                <li><strong>Business Data:</strong> Company name, store URL, brand information</li>
                <li><strong>Payment Information:</strong> Billing address, payment method (processed securely through Stripe)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.2 E-commerce Platform Data</h3>
              <p className="text-gray-700 mb-4">
                When you connect your e-commerce platforms (Shopify, WooCommerce, etc.), we collect:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Order data (order number, date, amounts, products)</li>
                <li>Product information (names, SKUs, costs, prices)</li>
                <li>Store metrics and analytics</li>
                <li><strong>Customer data (optional):</strong> Only if explicitly consented for analytics purposes</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.3 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>IP address and geolocation</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Usage data and analytics</li>
                <li>Cookies and tracking technologies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use your information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Service Delivery:</strong> To provide profit analytics and insights</li>
                <li><strong>Account Management:</strong> To create and manage your account</li>
                <li><strong>Payment Processing:</strong> To process subscription payments</li>
                <li><strong>Customer Support:</strong> To respond to inquiries and provide assistance</li>
                <li><strong>Service Improvement:</strong> To improve our platform and develop new features</li>
                <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security incidents</li>
                <li><strong>Legal Compliance:</strong> To comply with legal obligations</li>
                <li><strong>Marketing (with consent):</strong> To send promotional communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Legal Basis for Processing (GDPR)</h2>
              <p className="text-gray-700 mb-4">We process your personal data based on:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Contract Performance:</strong> Processing necessary to provide our services (GDPR Art. 6(1)(b))</li>
                <li><strong>Consent:</strong> Where you have given explicit consent (GDPR Art. 6(1)(a))</li>
                <li><strong>Legitimate Interests:</strong> For analytics, security, and service improvement (GDPR Art. 6(1)(f))</li>
                <li><strong>Legal Obligation:</strong> To comply with applicable laws (GDPR Art. 6(1)(c))</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-4">We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Service Providers:</strong> Stripe (payments), Vercel (hosting), Railway (database)</li>
                <li><strong>E-commerce Platforms:</strong> To sync your store data (Shopify, WooCommerce, etc.)</li>
                <li><strong>Analytics Providers:</strong> Google Analytics (if consented)</li>
                <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
              </ul>
              <p className="text-gray-700 mt-4">
                <strong>We never sell your personal data to third parties.</strong>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
              <p className="text-gray-700 mb-4">We retain your data for as long as:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Your account is active</li>
                <li>Needed to provide you with services</li>
                <li>Required by law (e.g., tax records: 7 years)</li>
              </ul>
              <p className="text-gray-700 mt-4">
                After account deletion, we may retain anonymized analytics data for business purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Your Rights (GDPR & CCPA)</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Under GDPR (EU Residents):</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
                <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
                <li><strong>Right to Data Portability:</strong> Receive your data in a machine-readable format</li>
                <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Under CCPA (California Residents):</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Right to Know:</strong> What personal information we collect</li>
                <li><strong>Right to Delete:</strong> Request deletion of your personal information</li>
                <li><strong>Right to Opt-Out:</strong> Opt-out of the sale of personal information (we don't sell data)</li>
                <li><strong>Right to Non-Discrimination:</strong> Equal service regardless of privacy choices</li>
              </ul>

              <p className="text-gray-700 mt-4">
                To exercise these rights, contact us at: <strong>privacy@shopimize.com</strong>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Data Security</h2>
              <p className="text-gray-700 mb-4">We implement appropriate technical and organizational measures:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Encryption in transit (TLS/SSL) and at rest (AES-256)</li>
                <li>Secure password hashing (bcrypt)</li>
                <li>Regular security audits and monitoring</li>
                <li>Access controls and authentication</li>
                <li>Secure data centers (SOC 2 compliant)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Cookies</h2>
              <p className="text-gray-700 mb-4">We use cookies for:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Necessary:</strong> Authentication, security, session management</li>
                <li><strong>Analytics:</strong> Usage statistics (Google Analytics) - requires consent</li>
                <li><strong>Functional:</strong> User preferences and settings - requires consent</li>
              </ul>
              <p className="text-gray-700 mt-4">
                You can manage cookie preferences through our cookie banner or browser settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. International Data Transfers</h2>
              <p className="text-gray-700">
                Your data may be transferred to and processed in countries outside your residence. We ensure adequate 
                safeguards through Standard Contractual Clauses (SCCs) approved by the European Commission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Children's Privacy</h2>
              <p className="text-gray-700">
                Our service is not intended for individuals under 16 years old. We do not knowingly collect data from children.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of significant changes via email 
                or prominent notice on our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Us</h2>
              <p className="text-gray-700 mb-4">For privacy-related inquiries or to exercise your rights:</p>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@shopimize.com<br/>
                  <strong>Data Protection Officer:</strong> dpo@shopimize.com
                </p>
              </div>
              <p className="text-gray-700 mt-4">
                <strong>EU Residents:</strong> You have the right to lodge a complaint with your local data protection authority.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
