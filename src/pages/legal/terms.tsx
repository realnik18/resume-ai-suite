export default function TermsPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Acceptance of Terms</h2>
            <p>By accessing and using ApplyPro AI, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Use License</h2>
            <p>Permission is granted to temporarily use our service for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">User Account</h2>
            <p>You are responsible for safeguarding the password and for maintaining the confidentiality of your account and password.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Prohibited Uses</h2>
            <p>You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Termination</h2>
            <p>We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion.</p>
          </section>
        </div>
      </div>
    </div>
  );
}