// app/page.tsx
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/ui/CheckoutButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Scissors, CalendarDays, DollarSign, Cloud, Laptop, BarChartBig, MessageSquareText, CreditCard, TrendingDown, Repeat, Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      
      {/* Cabeçalho */}
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Glossy</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost">Entrar</Button>
          <Button>Criar Conta Grátis</Button>
        </div>
      </header>

      <main className="flex-grow">
        {/* Seção 1: Slogan (Hero) */}
        <section className="container mx-auto px-4 text-center py-20 sm:py-28">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            A sua barbearia no próximo nível.
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Gerencie sua agenda, serviços e finanças em um só lugar. Simples, moderno e feito para o barbeiro de sucesso.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg">Comece a usar de graça</Button>
            <Button size="lg" variant="outline">Ver funcionalidades</Button>
          </div>
        </section>

        {/* Seção 2: O que o software faz (Funcionalidades) */}
        <section id="funcionalidades" className="bg-muted py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold">
                Chega de bagunça. Tenha total controle do seu negócio.
              </h3>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Nossa plataforma foi desenhada para resolver os maiores problemas do dia a dia de uma barbearia.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-4">
                    <CalendarDays className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Agenda Inteligente</CardTitle>
                  <CardDescription>
                    Visualize seus agendamentos por dia, semana ou mês. Chega de conflitos de horário e clientes esquecidos.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-4">
                    <Scissors className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Serviços e Preços</CardTitle>
                  <CardDescription>
                    Cadastre seus cortes, barbas e tratamentos, definindo preço e duração para cada um. Mantenha seu catálogo sempre atualizado.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-4">
                    <BarChartBig className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Balanço Financeiro</CardTitle>
                  <CardDescription>
                    Saiba exatamente quanto você ganhou no dia, na semana e no mês. Tome decisões inteligentes com relatórios claros e diretos.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Seção 3: Preços */}
        <section id="precos" className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold">
              Um plano para cada fase do seu negócio.
            </h3>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Comece de graça e evolua para o plano Pro quando estiver pronto para crescer sem limites.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Plano Freemium - Local */}
            <Card className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Laptop className="h-7 w-7" />
                  <CardTitle className="text-2xl">Plano Local</CardTitle>
                </div>
                <CardDescription>
                  Perfeito para quem está começando e quer organizar a agenda em um único computador.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-4xl font-bold mb-4">Grátis</p>
                <ul className="space-y-3 mb-6 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Até <strong>50 agendamentos</strong> por mês</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Cadastro de até <strong>10 serviços</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Relatório financeiro do dia e da semana</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span><strong>Dados salvos localmente no seu computador</strong></span>
                  </li>
                </ul>
                <Button className="w-full mt-auto" variant="outline">Começar Gratuitamente</Button>
              </CardContent>
            </Card>

            {/* Plano Pago - Nuvem */}
            <Card className="border-primary flex flex-col relative">
              <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  MAIS POPULAR
                </span>
              </div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Cloud className="h-7 w-7 text-primary" />
                  <CardTitle className="text-2xl">Plano Nuvem</CardTitle>
                </div>
                <CardDescription>
                  Para o profissional que não quer limites e precisa de acesso de qualquer lugar.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-4xl font-bold mb-4">R$ 19,99 <span className="text-lg font-normal text-muted-foreground">/mês</span></p>
                <ul className="space-y-3 mb-6 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Agendamentos <strong>ilimitados</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Serviços <strong>ilimitados</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Relatórios financeiros avançados</span>
                  </li>
                  <li className="flex items-center gap-2 font-semibold text-primary">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Sincronização na Nuvem</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Acesso de múltiplos dispositivos</span>
                  </li>
                   <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Backup automático e seguro</span>
                  </li>
                </ul>
                <CheckoutButton />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Seção 4: Em Breve na Nuvem */}
        <section id="em-breve" className="bg-muted py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-bold">
                O Futuro da Sua Barbearia Está na Nuvem
                </h3>
                <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Estamos trabalhando para trazer ainda mais poder para o Plano Nuvem. Prepare-se para as novidades que chegarão no próximo mês:
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                    <div className="bg-primary/10 p-3 rounded-full mb-4">
                        <MessageSquareText className="h-8 w-8 text-primary" />
                    </div>
                  <CardTitle>Lembretes via WhatsApp</CardTitle>
                  <CardDescription>
                    Reduza as faltas com lembretes automáticos de agendamento enviados diretamente para o WhatsApp dos seus clientes.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                    <div className="bg-primary/10 p-3 rounded-full mb-4">
                        <CreditCard className="h-8 w-8 text-primary" />
                    </div>
                  <CardTitle>Pagamentos Integrados</CardTitle>
                  <CardDescription>
                    Receba pagamentos com Cartão de Crédito e Pix diretamente pela plataforma. Mais agilidade para você e seus clientes.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                    <div className="bg-primary/10 p-3 rounded-full mb-4">
                        <TrendingDown className="h-8 w-8 text-primary" />
                    </div>
                  <CardTitle>Controle de Despesas</CardTitle>
                  <CardDescription>
                    Lance suas contas a pagar e despesas para ter uma visão completa da saúde financeira do seu negócio.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                    <div className="bg-primary/10 p-3 rounded-full mb-4">
                        <Repeat className="h-8 w-8 text-primary" />
                    </div>
                  <CardTitle>Tela de Movimentação</CardTitle>
                  <CardDescription>
                    Acompanhe todas as entradas e saídas em um único lugar, de forma clara e organizada.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                    <div className="bg-primary/10 p-3 rounded-full mb-4">
                        <Globe className="h-8 w-8 text-primary" />
                    </div>
                  <CardTitle>Página de Agendamento</CardTitle>
                  <CardDescription>
                    Seus clientes poderão agendar horários diretamente através de um link público e personalizado para sua barbearia.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} [Nome do seu App]. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}