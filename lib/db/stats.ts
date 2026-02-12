import { connectToDatabase } from "lib/db/connect";
import { User } from "lib/db/models/User";
import { Product } from "lib/db/models/Product";
import { Comment } from "lib/db/models/Comment";

export async function getAdminStats() {
  await connectToDatabase();

  const [userCount, productCount, commentCount, avgRatingAgg] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Comment.countDocuments(),
    Comment.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
        },
      },
    ]),
  ]);

  const avgRating = avgRatingAgg[0]?.avgRating ?? null;

  // Fake monthly sales data for now
  const fakeSales = [
    { month: "Jan", amount: 4200 },
    { month: "Feb", amount: 5100 },
    { month: "Mar", amount: 6300 },
    { month: "Apr", amount: 5800 },
    { month: "May", amount: 7200 },
    { month: "Jun", amount: 6900 },
  ];

  return {
    userCount,
    productCount,
    commentCount,
    avgRating,
    fakeSales,
  };
}

