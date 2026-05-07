import { useState } from "react";
import { Plus } from "lucide-react";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { ListItemBase } from "@/components/ui/ListItemBase";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import Header from "@/components/layout/Header";
import AddExpense from "@/features/budget/components/AddExpenseModal";
import AddIncome from "@/features/budget/components/AddIncomeModal";

import { useBudgetActions } from "@/features/budget/hooks/useBudgetActions";
import { useBudgetData } from "@/features/budget/hooks/useBudgetData";
import { IntelligentEmptyState } from "@/components/ui/IntelligentEmptyState";
import { HeroTitle, Metric, Meta, Label, Body } from "@/components/ui/Text";

const BudgetPage = () => {
  const data = useBudgetData();
  const actions = useBudgetActions();

  const [openExpense, setOpenExpense] = useState(false);
  const [openIncome, setOpenIncome] = useState(false);

  return (
    <div className="space-y-4">
      <Header title="Budget" />

      {/* TOP CARD */}
      <Card variant="budget">
        <CardBody>
          <div className="space-y-4">
            <HeroTitle>Weekly Budget</HeroTitle>

            <Metric>
              ${data.remaining.toFixed(2)}
            </Metric>

            <Meta>
              remaining of ${data.income.toFixed(2)}
            </Meta>

            <ProgressBar
              value={data.spentPercentage}
              variant="default"
              ariaLabel="Budget used"
            />

            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="space-y-1">
                <Label>Income</Label>
                <Meta className="font-semibold">
                  ${data.income.toFixed(2)}
                </Meta>
              </div>

              <div className="space-y-1">
                <Label>Expenses</Label>
                <Meta className="font-semibold">
                  ${data.totalExpenses.toFixed(2)}
                </Meta>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* TRANSACTIONS */}
      <Card>
        <CardHeader title="Transactions" />
        <CardBody>
          {data.expenses.length === 0 ? (
            <IntelligentEmptyState
              context="budget"
              isFirstTime={true}
              action={
                <Button onClick={() => setOpenExpense(true)} variant="primary">
                  Add Transaction
                </Button>
              }
            />
          ) : (
            <div className="space-y-1">
              {data.expenses.map((item) => (
                <div key={item.id} className="px-2 py-2">
                  <ListItemBase
                    label={
                      <Body className="font-medium">
                        {item.name}
                      </Body>
                    }
                    right={
                      <Body className="font-semibold">
                        -${item.amount.toFixed(2)}
                      </Body>
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <div className="space-y-4 pt-2">
        <Button
          fullWidth
          variant="secondary"
          onClick={() => setOpenIncome(true)}
          aria-label="Add income"
        >
          <Plus size={16} /> Add Income
        </Button>

        <Button
          fullWidth
          variant="primary"
          onClick={() => setOpenExpense(true)}
          aria-label="Add expense"
        >
          <Plus size={16} /> Add Expense
        </Button>
      </div>

      <AddExpense
        open={openExpense}
        onClose={() => setOpenExpense(false)}
        onSave={actions.addExpense}
      />

      <AddIncome
        open={openIncome}
        onClose={() => setOpenIncome(false)}
        onSave={actions.setIncome}
      />
    </div>
  );
};

export default BudgetPage;
