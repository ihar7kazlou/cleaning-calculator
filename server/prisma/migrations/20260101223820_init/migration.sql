-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'TRAINEE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scenario" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "rootNodeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DialogNode" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "hint" TEXT,
    "edgesJson" TEXT NOT NULL,

    CONSTRAINT "DialogNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RubricItem" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "ruleJson" TEXT,

    CONSTRAINT "RubricItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Run" (
    "id" TEXT NOT NULL,
    "traineeId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "transcript" TEXT,
    "metricsJson" TEXT,
    "score" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CleaningCalculation" (
    "id" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "rooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "frequency" TEXT NOT NULL,
    "addWindowCleaning" BOOLEAN NOT NULL DEFAULT false,
    "addCarpetCleaning" BOOLEAN NOT NULL DEFAULT false,
    "baseCost" DOUBLE PRECISION NOT NULL,
    "windowCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "carpetCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CleaningCalculation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CleaningCache" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CleaningCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CleaningCache_key_key" ON "CleaningCache"("key");

-- AddForeignKey
ALTER TABLE "DialogNode" ADD CONSTRAINT "DialogNode_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RubricItem" ADD CONSTRAINT "RubricItem_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_traineeId_fkey" FOREIGN KEY ("traineeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

