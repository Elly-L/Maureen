"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, Minus, BrainCircuit, Check } from "lucide-react"
import { generatePriceRecommendation, type PriceRecommendation } from "@/lib/price-optimization"
import { Progress } from "@/components/ui/progress"

interface PriceRecommendationProps {
  category: string
  currentPrice: number | string
  unit: string
  onApply: (price: number) => void
}

export function PriceRecommendationCard({ category, currentPrice, unit, onApply }: PriceRecommendationProps) {
  const [loading, setLoading] = useState(true)
  const [recommendation, setRecommendation] = useState<PriceRecommendation | null>(null)

  // Simulate loading and generating recommendation
  useState(() => {
    const timer = setTimeout(() => {
      const price = typeof currentPrice === "string" ? Number.parseFloat(currentPrice) || 0 : currentPrice
      setRecommendation(generatePriceRecommendation(category, price, unit))
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  })

  if (loading) {
    return (
      <Card className="mt-4 border-dashed border-muted">
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center gap-2">
            <BrainCircuit className="h-4 w-4" />
            <span>Generating price recommendation...</span>
          </CardTitle>
          <CardDescription>Our AI is analyzing market data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-2/3 bg-muted rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!recommendation) return null

  const currentPriceNum = typeof currentPrice === "string" ? Number.parseFloat(currentPrice) || 0 : currentPrice
  const priceDifference = recommendation.recommendedPrice - currentPriceNum
  const percentDifference = currentPriceNum ? Math.round((priceDifference / currentPriceNum) * 100) : 0

  return (
    <Card className="mt-4 border-blue-200 bg-blue-50/50 dark:bg-blue-950/10">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-blue-500" />
            <span>AI Price Recommendation</span>
          </CardTitle>
          <Badge
            variant={
              recommendation.marketTrend === "rising"
                ? "destructive"
                : recommendation.marketTrend === "falling"
                  ? "default"
                  : "secondary"
            }
            className="px-2 py-0 h-5"
          >
            {recommendation.marketTrend === "rising" && <ArrowUp className="h-3 w-3 mr-1" />}
            {recommendation.marketTrend === "falling" && <ArrowDown className="h-3 w-3 mr-1" />}
            {recommendation.marketTrend === "stable" && <Minus className="h-3 w-3 mr-1" />}
            Market {recommendation.marketTrend}
          </Badge>
        </div>
        <CardDescription>Based on current market data and trends</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-sm text-muted-foreground">Recommended price:</div>
            <div className="text-2xl font-bold">
              KSh {recommendation.recommendedPrice}/{unit}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Price range:</div>
            <div className="text-sm font-medium">
              KSh {recommendation.minPrice} - {recommendation.maxPrice}/{unit}
            </div>
          </div>
        </div>

        {currentPriceNum > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span>
                Your price: KSh {currentPriceNum}/{unit}
              </span>
              <Badge
                variant={priceDifference > 0 ? "destructive" : priceDifference < 0 ? "default" : "secondary"}
                className="px-2 py-0 h-5"
              >
                {priceDifference !== 0 ? (
                  <>
                    {priceDifference > 0 ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(percentDifference)}% {priceDifference > 0 ? "higher" : "lower"}
                  </>
                ) : (
                  "Optimal"
                )}
              </Badge>
            </div>
          </div>
        )}

        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Confidence</span>
            <span className="font-medium">{recommendation.confidence}%</span>
          </div>
          <Progress value={recommendation.confidence} className="h-2" />
        </div>

        <div className="space-y-1 mt-4">
          <h4 className="text-sm font-medium">Analysis:</h4>
          <ul className="text-sm space-y-1">
            {recommendation.reasoning.map((reason, index) => (
              <li key={index} className="text-muted-foreground">
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onApply(recommendation.recommendedPrice)}
          variant="outline"
          className="w-full border-blue-200 bg-blue-100/50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:border-blue-800"
        >
          <Check className="h-4 w-4 mr-2" />
          Apply Recommended Price
        </Button>
      </CardFooter>
    </Card>
  )
}
