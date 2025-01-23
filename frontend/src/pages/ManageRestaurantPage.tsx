import {
  useCreateMyRestaurant,
  useGetMyRestaurant,
  useGetMyRestaurantOrders,
  useUpdateMyRestaurant,
} from "@/api/MyRestaurantApi";
import OrderItemCard from "@/components/OrderItemCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm";
import { Loader2 } from "lucide-react";

const ManageRestaurantPage = () => {
  const { createRestaurant, isLoading: isCreateLoading } = useCreateMyRestaurant();
  const { restaurant, isLoading: isLoadingRestaurant } = useGetMyRestaurant();
  const { updateRestaurant, isLoading: isUpdateLoading } = useUpdateMyRestaurant();
  
  const { orders, isLoading: isLoadingOrders } = useGetMyRestaurantOrders();
  
  // Check if the "restaurant" object exists to determine if the user is in edit mode
  // If "restaurant" exists, "isEditing" will be true; otherwise, it will be false
  const isEditing = !!restaurant;

  if (isLoadingRestaurant || isLoadingOrders) {
    return (
      <span className="flex justify-center items-center -mt-[85px] w-full h-[100vh]">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </span>
    )
  }

  return (
    <Tabs defaultValue="orders">
      <TabsList>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="manage-restaurant">Manage Restaurant</TabsTrigger>
      </TabsList>
      <TabsContent
        value="orders"
        className="space-y-5 bg-gray-50 p-10 rounded-lg"
      >
        <h2 className="text-2xl font-bold">{orders?.length} active orders</h2>
        {orders?.map((order) => (
          <OrderItemCard order={order} />
        ))}
      </TabsContent>
      <TabsContent value="manage-restaurant">
        <ManageRestaurantForm
          restaurant={restaurant}
          onSave={isEditing ? updateRestaurant : createRestaurant}
          isLoading={isCreateLoading || isUpdateLoading}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ManageRestaurantPage;
