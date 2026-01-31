export default function CustomerDashboardPage() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Customer Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your customer dashboard
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Add your customer dashboard widgets here */}
        </div>
      </div>
    );
  }