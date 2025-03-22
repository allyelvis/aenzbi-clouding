import type React from "react"
import Link from "next/link"
import { HelpCircle, Book, FileText, MessageCircle, Video, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HelpPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">Find answers to common questions and get support</p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">How can we help you?</span>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative w-full max-w-2xl">
          <HelpCircle className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input type="search" placeholder="Search for help articles..." className="pl-10 pr-10" />
          <Button className="absolute right-1 top-1" size="sm">
            Search
          </Button>
        </div>
      </div>

      <Tabs defaultValue="guides">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="guides" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <HelpCard
              title="Getting Started"
              description="Learn the basics of using AENZBi Cloud"
              icon={<Book className="h-5 w-5" />}
              href="/help/getting-started"
            />
            <HelpCard
              title="Inventory Management"
              description="How to manage your inventory effectively"
              icon={<FileText className="h-5 w-5" />}
              href="/help/inventory"
            />
            <HelpCard
              title="Sales & Orders"
              description="Process sales and manage orders"
              icon={<FileText className="h-5 w-5" />}
              href="/help/sales"
            />
            <HelpCard
              title="Financial Management"
              description="Track income, expenses, and financial performance"
              icon={<FileText className="h-5 w-5" />}
              href="/help/finance"
            />
            <HelpCard
              title="User Management"
              description="Manage user accounts and permissions"
              icon={<FileText className="h-5 w-5" />}
              href="/help/users"
            />
            <HelpCard
              title="Reports & Analytics"
              description="Generate insights with reports and analytics"
              icon={<FileText className="h-5 w-5" />}
              href="/help/reports"
            />
          </div>
        </TabsContent>

        <TabsContent value="faq" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions about AENZBi Cloud</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I reset my password?</AccordionTrigger>
                  <AccordionContent>
                    To reset your password, click on the "Forgot Password" link on the login page. You will receive an
                    email with instructions to reset your password. Follow the link in the email to create a new
                    password.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I add a new user to the system?</AccordionTrigger>
                  <AccordionContent>
                    To add a new user, go to Settings &gt; User Management. Click on the "Add User" button and fill in
                    the required information. The new user will receive an email with login instructions.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How do I create a backup of my data?</AccordionTrigger>
                  <AccordionContent>
                    To create a backup, go to Settings &gt; Backup & Restore. Select the data you want to include in the
                    backup and click "Create Backup". The backup will be created and can be downloaded for safekeeping.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>How do I generate reports?</AccordionTrigger>
                  <AccordionContent>
                    To generate reports, go to the Reports section. Select the type of report you want to generate, set
                    the date range and other parameters, and click "Generate Report". You can then view, download, or
                    export the report.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>How do I set up inventory alerts?</AccordionTrigger>
                  <AccordionContent>
                    To set up inventory alerts, go to Inventory &gt; Settings. You can configure low stock thresholds
                    for products and set up email notifications for when stock levels reach these thresholds.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started Tutorial</CardTitle>
                <CardDescription>A comprehensive guide to getting started with AENZBi Cloud</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-md bg-muted/20 flex items-center justify-center">
                  <Video className="h-12 w-12 text-muted-foreground" />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Watch Video
                  </a>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>Learn how to effectively manage your inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-md bg-muted/20 flex items-center justify-center">
                  <Video className="h-12 w-12 text-muted-foreground" />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Watch Video
                  </a>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Sales & Orders</CardTitle>
                <CardDescription>Learn how to process sales and manage orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-md bg-muted/20 flex items-center justify-center">
                  <Video className="h-12 w-12 text-muted-foreground" />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Watch Video
                  </a>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
                <CardDescription>Learn how to generate insights with reports and analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-md bg-muted/20 flex items-center justify-center">
                  <Video className="h-12 w-12 text-muted-foreground" />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Watch Video
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Get in touch with our support team for assistance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Email Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Send us an email and we'll get back to you within 24 hours.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="mailto:support@aenzbi.com">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        support@aenzbi.com
                      </a>
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Live Chat</h3>
                    <p className="text-sm text-muted-foreground">
                      Chat with our support team in real-time during business hours.
                    </p>
                    <Button className="w-full">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Start Live Chat
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Phone Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Call us for immediate assistance during business hours.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="tel:+1-555-123-4567">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        +1 (555) 123-4567
                      </a>
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Support Hours</h3>
                    <p className="text-sm text-muted-foreground">
                      Our support team is available Monday to Friday, 9 AM to 5 PM EST.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function HelpCard({
  title,
  description,
  icon,
  href,
}: {
  title: string
  description: string
  icon: React.ReactNode
  href: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="rounded-md bg-primary/10 p-2 text-primary">{icon}</div>
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={href}>View Guide</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

