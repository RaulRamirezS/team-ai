"use client";

import { defineStepper } from "@stepperize/react";
import { Check, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { PROMPT_SUBMIT_EVENT } from "@/components/ai-prompt-section";
import type { AiResponseContext } from "@/components/ai-response-panel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const INDUSTRIES = [
  "Technology, Media, and Telecommunications",
  "Healthcare & Wellness",
  "Finances & Banking",
  "Travel and Hospitality",
  "Retail & Distribution",
  "Logistics and Transportation",
  "Business Services",
  "Oil and Gas Digital Solutions",
] as const;

const ERP_SYSTEMS = [
  "SAP",
  "Oracle",
  "JD Edwards",
  "Microsoft Dynamics 365",
  "NetSuite",
  "Infor",
  "Epicor",
  "Sage",
  "Workday",
  "IFS",
] as const;

const CRM_SYSTEMS = [
  "Salesforce",
  "HubSpot",
  "Zoho",
  "Monday.com",
  "Microsoft Dynamics 365",
  "Pipedrive",
  "Freshsales",
  "SugarCRM",
  "Zendesk Sell",
  "Copper",
] as const;

const HOSTING_OPTIONS = [
  "Google Cloud Platform",
  "Azure",
  "AWS",
  "Own infrastructure",
] as const;

const OTHER_OPTION = "Other";

type YesNo = "yes" | "no" | "";

type IndustryStepData = {
  industry: string;
  otherIndustry?: string;
};

type TechStackStepData = {
  erpSystem: string;
  otherErpSystem?: string;
  crmSystem: string;
  otherCrmSystem?: string;
  hostingStrategy: string;
  otherHostingStrategy?: string;
};

type CustomSoftwareEntry = {
  id: string;
  name: string;
  description: string;
  hasOwnDatabase: YesNo;
  needsModernization: YesNo;
};

type CustomSoftwareStepData = {
  systems: CustomSoftwareEntry[];
};

type SpecialRequestFocus =
  | "ai-opportunity"
  | "close-gap"
  | "fix-problem";

const SPECIAL_REQUEST_FOCUSES: {
  id: SpecialRequestFocus;
  label: string;
  helper: string;
}[] = [
  {
    id: "ai-opportunity",
    label: "AI improvement opportunity",
    helper: "Find where AI could save time or improve results",
  },
  {
    id: "close-gap",
    label: "Close a gap",
    helper: "Fill a missing capability in your current tools",
  },
  {
    id: "fix-problem",
    label: "Fix a special problem",
    helper: "Solve a specific pain point holding the team back",
  },
];

/** The model needs the human label and intent, not the internal id. */
function describeSpecialRequestFocus(id: SpecialRequestFocus): string {
  const focus = SPECIAL_REQUEST_FOCUSES.find((entry) => entry.id === id);
  return focus ? `${focus.label} — ${focus.helper}` : id;
}

const SPECIAL_REQUEST_IDEAS = [
  "Automate repetitive manual work that slows our team down",
  "Connect systems that do not talk to each other today",
  "Reduce errors in data entry, reporting, or handoffs",
  "Speed up approvals or customer response times",
  "Replace a spreadsheet-based process with a reliable tool",
  "Improve forecasting or decision-making with better insights",
  "Modernize an outdated tool our team depends on every day",
  "Add a missing feature our current software does not cover",
] as const;

const { Stepper } = defineStepper([
  {
    id: "industry",
    title: "Your industry",
  },
  {
    id: "tech-stack",
    title: "Your tech stack",
  },
  {
    id: "custom-software",
    title: "Your current custom software",
  },
  {
    id: "special-request",
    title: "Special request",
  },
]);

function createEmptySoftwareEntry(): CustomSoftwareEntry {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `software-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: "",
    description: "",
    hasOwnDatabase: "",
    needsModernization: "",
  };
}

function SelectWithOtherField({
  id,
  label,
  placeholder,
  otherPlaceholder,
  options,
  value,
  otherValue,
  onChange,
  onOtherChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  otherPlaceholder: string;
  options: readonly string[];
  value: string;
  otherValue: string;
  onChange: (value: string) => void;
  onOtherChange: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <Select
          value={value || null}
          onValueChange={(next) => onChange(next ?? "")}
        >
          <SelectTrigger id={id} className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} align="start">
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
            <SelectItem value={OTHER_OPTION}>{OTHER_OPTION}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {value === OTHER_OPTION && (
        <div className="space-y-2">
          <Label htmlFor={`${id}-other`}>Please specify</Label>
          <Input
            id={`${id}-other`}
            value={otherValue}
            onChange={(event) => onOtherChange(event.target.value)}
            placeholder={otherPlaceholder}
            className="h-9"
          />
        </div>
      )}
    </div>
  );
}

function TechStackStepFields({
  erpSystem,
  otherErpSystem,
  crmSystem,
  otherCrmSystem,
  hostingStrategy,
  otherHostingStrategy,
  onErpChange,
  onOtherErpChange,
  onCrmChange,
  onOtherCrmChange,
  onHostingChange,
  onOtherHostingChange,
}: {
  erpSystem: string;
  otherErpSystem: string;
  crmSystem: string;
  otherCrmSystem: string;
  hostingStrategy: string;
  otherHostingStrategy: string;
  onErpChange: (value: string) => void;
  onOtherErpChange: (value: string) => void;
  onCrmChange: (value: string) => void;
  onOtherCrmChange: (value: string) => void;
  onHostingChange: (value: string) => void;
  onOtherHostingChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <SelectWithOtherField
        id="erp-system"
        label="ERP system"
        placeholder="Select your ERP system"
        otherPlaceholder="Type your ERP system"
        options={ERP_SYSTEMS}
        value={erpSystem}
        otherValue={otherErpSystem}
        onChange={onErpChange}
        onOtherChange={onOtherErpChange}
      />
      <SelectWithOtherField
        id="crm-system"
        label="CRM"
        placeholder="Select your CRM"
        otherPlaceholder="Type your CRM"
        options={CRM_SYSTEMS}
        value={crmSystem}
        otherValue={otherCrmSystem}
        onChange={onCrmChange}
        onOtherChange={onOtherCrmChange}
      />
      <div className="sm:col-span-2">
        <SelectWithOtherField
          id="hosting-strategy"
          label="Hosting strategy"
          placeholder="Select your hosting strategy"
          otherPlaceholder="Type your hosting strategy"
          options={HOSTING_OPTIONS}
          value={hostingStrategy}
          otherValue={otherHostingStrategy}
          onChange={onHostingChange}
          onOtherChange={onOtherHostingChange}
        />
      </div>
    </div>
  );
}

function YesNoToggle({
  label,
  value,
  onChange,
  name,
}: {
  label: string;
  value: YesNo;
  onChange: (value: YesNo) => void;
  name: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex gap-2" role="group" aria-label={label}>
        {(["yes", "no"] as const).map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              name={name}
              aria-pressed={selected}
              onClick={() => onChange(option)}
              className={cn(
                "inline-flex h-9 flex-1 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors",
                selected
                  ? "border-[#FDBE00] bg-[#FDBE00] text-black"
                  : "border-input bg-background text-foreground hover:bg-muted",
              )}
            >
              {option === "yes" ? "Yes" : "No"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CustomSoftwareStepFields({
  systems,
  onChange,
}: {
  systems: CustomSoftwareEntry[];
  onChange: (systems: CustomSoftwareEntry[]) => void;
}) {
  const updateSystem = (
    id: string,
    patch: Partial<Omit<CustomSoftwareEntry, "id">>,
  ) => {
    onChange(
      systems.map((system) =>
        system.id === id ? { ...system, ...patch } : system,
      ),
    );
  };

  const removeSystem = (id: string) => {
    if (systems.length === 1) {
      onChange([createEmptySoftwareEntry()]);
      return;
    }
    onChange(systems.filter((system) => system.id !== id));
  };

  return (
    <div className="space-y-4">
      {systems.map((system, index) => (
        <Card key={system.id} size="sm" className="bg-white">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <CardTitle className="text-base">
              Custom software {index + 1}
            </CardTitle>
            {systems.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove custom software ${index + 1}`}
                onClick={() => removeSystem(system.id)}
              >
                <Trash2 />
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`software-name-${system.id}`}>
                What do you call it?{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id={`software-name-${system.id}`}
                value={system.name}
                onChange={(event) =>
                  updateSystem(system.id, { name: event.target.value })
                }
                placeholder="e.g. Inventory tracker, Scheduling tool"
                className="h-9"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`software-description-${system.id}`}>
                What does it do?
              </Label>
              <Textarea
                id={`software-description-${system.id}`}
                value={system.description}
                onChange={(event) =>
                  updateSystem(system.id, { description: event.target.value })
                }
                placeholder="Briefly describe what this software helps your team do day to day."
                className="min-h-24"
              />
            </div>

            <YesNoToggle
              name={`has-database-${system.id}`}
              label="Does it store its own data (its own database)?"
              value={system.hasOwnDatabase}
              onChange={(hasOwnDatabase) =>
                updateSystem(system.id, { hasOwnDatabase })
              }
            />

            <YesNoToggle
              name={`needs-modernization-${system.id}`}
              label="Does it need to be modernized or replaced?"
              value={system.needsModernization}
              onChange={(needsModernization) =>
                updateSystem(system.id, { needsModernization })
              }
            />
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => onChange([...systems, createEmptySoftwareEntry()])}
      >
        <Plus data-icon="inline-start" />
        Add one more
      </Button>
    </div>
  );
}

function isSelectWithOtherComplete(value: string, otherValue: string) {
  return (
    value !== "" &&
    (value !== OTHER_OPTION || otherValue.trim().length > 0)
  );
}

function SpecialRequestStepFields({
  focuses,
  details,
  onFocusesChange,
  onDetailsChange,
}: {
  focuses: SpecialRequestFocus[];
  details: string;
  onFocusesChange: (focuses: SpecialRequestFocus[]) => void;
  onDetailsChange: (details: string) => void;
}) {
  const toggleFocus = (focus: SpecialRequestFocus) => {
    onFocusesChange(
      focuses.includes(focus)
        ? focuses.filter((item) => item !== focus)
        : [...focuses, focus],
    );
  };

  const applyIdea = (idea: string) => {
    const trimmed = details.trim();
    if (!trimmed) {
      onDetailsChange(idea);
      return;
    }
    if (trimmed.includes(idea)) {
      return;
    }
    onDetailsChange(`${trimmed}${trimmed.endsWith(".") ? "" : "."} ${idea}`);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <Label>What are you looking for?</Label>
        <div className="grid gap-2">
          {SPECIAL_REQUEST_FOCUSES.map((focus) => {
            const selected = focuses.includes(focus.id);
            return (
              <button
                key={focus.id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleFocus(focus.id)}
                className={cn(
                  "rounded-lg border px-3 py-3 text-left transition-colors",
                  selected
                    ? "border-[#FDBE00] bg-[#FDBE00]/15"
                    : "border-input bg-background hover:bg-muted/60",
                )}
              >
                <span className="block text-sm font-medium">{focus.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {focus.helper}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="special-request-details">
          Describe your special request
        </Label>
        <Textarea
          id="special-request-details"
          value={details}
          onChange={(event) => onDetailsChange(event.target.value)}
          placeholder="Share the opportunity, gap, or problem you want help with."
          className="min-h-28"
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Need ideas? Tap one to add it</p>
        <div className="flex flex-wrap gap-2">
          {SPECIAL_REQUEST_IDEAS.map((idea) => (
            <button
              key={idea}
              type="button"
              onClick={() => applyIdea(idea)}
              className="rounded-full border border-input bg-background px-3 py-1.5 text-left text-xs text-foreground transition-colors hover:border-[#FDBE00] hover:bg-[#FDBE00]/10"
            >
              {idea}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function VerticalStepperBlock({
  onAiResponseReady,
}: {
  onAiResponseReady?: (context: AiResponseContext) => void;
} = {}) {
  const [industry, setIndustry] = useState("");
  const [otherIndustry, setOtherIndustry] = useState("");
  const [erpSystem, setErpSystem] = useState("");
  const [otherErpSystem, setOtherErpSystem] = useState("");
  const [crmSystem, setCrmSystem] = useState("");
  const [otherCrmSystem, setOtherCrmSystem] = useState("");
  const [hostingStrategy, setHostingStrategy] = useState("");
  const [otherHostingStrategy, setOtherHostingStrategy] = useState("");
  const [customSoftware, setCustomSoftware] = useState<CustomSoftwareEntry[]>([
    createEmptySoftwareEntry(),
  ]);
  const [specialRequestFocuses, setSpecialRequestFocuses] = useState<
    SpecialRequestFocus[]
  >([]);
  const [specialRequestDetails, setSpecialRequestDetails] = useState("");

  // Prefill the final step with the project need typed in the hero prompt box.
  useEffect(() => {
    const onPromptSubmit = (event: Event) => {
      const prompt = (event as CustomEvent<string>).detail?.trim();
      if (prompt) setSpecialRequestDetails(prompt);
    };
    window.addEventListener(PROMPT_SUBMIT_EVENT, onPromptSubmit);
    return () =>
      window.removeEventListener(PROMPT_SUBMIT_EVENT, onPromptSubmit);
  }, []);

  const canContinueIndustry = isSelectWithOtherComplete(
    industry,
    otherIndustry,
  );

  return (
    <div id="assessment-stepper">
      <Stepper.Root
        orientation="horizontal"
        className="w-full rounded-xl border bg-background p-6 shadow-sm"
      >
        {({ stepper }) => {
          const goNext = () => {
            if (stepper.current.id === "industry") {
              const data: IndustryStepData = {
                industry,
                ...(industry === OTHER_OPTION
                  ? { otherIndustry: otherIndustry.trim() }
                  : {}),
              };
              void stepper.next({ data });
              return;
            }

            if (stepper.current.id === "tech-stack") {
              const data: TechStackStepData = {
                erpSystem,
                crmSystem,
                hostingStrategy,
                ...(erpSystem === OTHER_OPTION
                  ? { otherErpSystem: otherErpSystem.trim() }
                  : {}),
                ...(crmSystem === OTHER_OPTION
                  ? { otherCrmSystem: otherCrmSystem.trim() }
                  : {}),
                ...(hostingStrategy === OTHER_OPTION
                  ? { otherHostingStrategy: otherHostingStrategy.trim() }
                  : {}),
              };
              void stepper.next({ data });
              return;
            }

            if (stepper.current.id === "custom-software") {
              const data: CustomSoftwareStepData = {
                systems: customSoftware.map((system) => ({
                  ...system,
                  name: system.name.trim(),
                  description: system.description.trim(),
                })),
              };
              void stepper.next({ data });
              return;
            }

            void stepper.next();
          };

          const finish = () => {
            const meaningfulSoftware = customSoftware
              .map((system) => ({
                name: system.name.trim(),
                description: system.description.trim(),
                hasOwnDatabase: system.hasOwnDatabase || undefined,
                needsModernization: system.needsModernization || undefined,
              }))
              .filter(
                (system) =>
                  system.name ||
                  system.description ||
                  system.hasOwnDatabase ||
                  system.needsModernization,
              );

            onAiResponseReady?.({
              industry,
              otherIndustry,
              erpSystem,
              otherErpSystem,
              crmSystem,
              otherCrmSystem,
              hostingStrategy,
              otherHostingStrategy,
              specialRequestDetails,
              specialRequestFocuses: specialRequestFocuses.map(
                describeSpecialRequestFocus,
              ),
              ...(meaningfulSoftware.length > 0
                ? { customSoftware: meaningfulSoftware }
                : {}),
            });
            requestAnimationFrame(() => {
              document.getElementById("ai-response-panel")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            });
          };

          const canContinue =
            stepper.current.id === "industry" ? canContinueIndustry : true;

          return (
            <div className="flex flex-col gap-6">
              <Stepper.List
                orientation="horizontal"
                className="flex w-full list-none items-start p-0"
              >
                <Stepper.Items>
                  {(step, index) => (
                    <Stepper.Item
                      key={step.id}
                      step={step.id}
                      className="group/item relative flex min-w-0 flex-1 flex-col items-center"
                    >
                      {index < stepper.count - 1 && (
                        <div className="absolute top-3.5 left-[calc(50%+1rem)] right-[calc(-50%+1rem)] h-px bg-border group-data-[status=previous]/item:bg-[#FDBE00]" />
                      )}
                      <Stepper.Trigger className="relative z-10 flex max-w-full flex-col items-center gap-2 bg-background px-1 text-center">
                        <Stepper.Indicator className="group grid size-7 place-items-center rounded-full border border-[#FDBE00] bg-[#FDBE00] text-xs font-semibold text-black transition-colors data-[status=upcoming]:border-border data-[status=upcoming]:bg-background data-[status=upcoming]:text-muted-foreground">
                          <span className="group-data-[status=previous]:hidden">
                            {index + 1}
                          </span>
                          <Check className="hidden size-3.5 group-data-[status=previous]:block" />
                        </Stepper.Indicator>
                        <Stepper.Title
                          className={cn(
                            "block text-xs font-medium leading-tight sm:text-sm",
                            "group-data-[status=current]/item:font-semibold group-data-[status=current]/item:text-neutral-900",
                            "group-data-[status=previous]/item:text-neutral-700",
                            "group-data-[status=upcoming]/item:text-muted-foreground",
                          )}
                        />
                      </Stepper.Trigger>
                    </Stepper.Item>
                  )}
                </Stepper.Items>
              </Stepper.List>

              <div className="min-w-0">
                <div className="rounded-lg border bg-muted/30 p-4">
                  {stepper.current.id === "industry" ? (
                    <SelectWithOtherField
                      id="industry"
                      label="Industry"
                      placeholder="Select your industry"
                      otherPlaceholder="Type your industry"
                      options={INDUSTRIES}
                      value={industry}
                      otherValue={otherIndustry}
                      onChange={(next) => {
                        setIndustry(next);
                        if (next !== OTHER_OPTION) {
                          setOtherIndustry("");
                        }
                      }}
                      onOtherChange={setOtherIndustry}
                    />
                  ) : stepper.current.id === "tech-stack" ? (
                    <TechStackStepFields
                      erpSystem={erpSystem}
                      otherErpSystem={otherErpSystem}
                      crmSystem={crmSystem}
                      otherCrmSystem={otherCrmSystem}
                      hostingStrategy={hostingStrategy}
                      otherHostingStrategy={otherHostingStrategy}
                      onErpChange={(next) => {
                        setErpSystem(next);
                        if (next !== OTHER_OPTION) {
                          setOtherErpSystem("");
                        }
                      }}
                      onOtherErpChange={setOtherErpSystem}
                      onCrmChange={(next) => {
                        setCrmSystem(next);
                        if (next !== OTHER_OPTION) {
                          setOtherCrmSystem("");
                        }
                      }}
                      onOtherCrmChange={setOtherCrmSystem}
                      onHostingChange={(next) => {
                        setHostingStrategy(next);
                        if (next !== OTHER_OPTION) {
                          setOtherHostingStrategy("");
                        }
                      }}
                      onOtherHostingChange={setOtherHostingStrategy}
                    />
                  ) : stepper.current.id === "custom-software" ? (
                    <CustomSoftwareStepFields
                      systems={customSoftware}
                      onChange={setCustomSoftware}
                    />
                  ) : (
                    <SpecialRequestStepFields
                      focuses={specialRequestFocuses}
                      details={specialRequestDetails}
                      onFocusesChange={setSpecialRequestFocuses}
                      onDetailsChange={setSpecialRequestDetails}
                    />
                  )}
                </div>

                <Stepper.Actions className="mt-6 flex items-center justify-between gap-3">
                  <Stepper.Prev className="inline-flex h-9 items-center rounded-lg border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50">
                    Back
                  </Stepper.Prev>

                  {stepper.isLast ? (
                    <button
                      type="button"
                      onClick={finish}
                      className="inline-flex h-9 items-center rounded-lg bg-[#FDBE00] px-4 text-sm font-medium text-black transition-colors hover:bg-[#FDBE00]/90"
                    >
                      Get AI response
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={!canContinue}
                      className="inline-flex h-9 items-center rounded-lg bg-[#FDBE00] px-4 text-sm font-medium text-black transition-colors hover:bg-[#FDBE00]/90 disabled:pointer-events-none disabled:opacity-50"
                    >
                      Continue
                    </button>
                  )}
                </Stepper.Actions>
              </div>
            </div>
          );
        }}
      </Stepper.Root>
    </div>
  );
}

export default VerticalStepperBlock;
