import { Review } from "../types/review";

export const mockReviews: Review[] = Array(10)
    .fill({})
    .map((_, index) => ({
        id: index,
        role: "Current software engineer",
        createdAt: "2025-03-05T15:27:06.997Z",
        rating: 4,
        description:
            "Top-notch perks, including comprehensive health insurance, a competitive 401(k) retirement plan with matching contributions, generous paid time off, wellness programs, professional development opportunities, and additional benefits  such as childcare support, commuter allowances, and employee discounts.",
    }));
