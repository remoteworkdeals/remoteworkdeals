export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string
          excerpt: string | null
          featured: boolean | null
          featured_image: string | null
          featured_image_alt: string | null
          id: string
          linked_listings: number[] | null
          read_time: string | null
          slug: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          category: string
          content: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          featured_image?: string | null
          featured_image_alt?: string | null
          id?: string
          linked_listings?: number[] | null
          read_time?: string | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          featured_image?: string | null
          featured_image_alt?: string | null
          id?: string
          linked_listings?: number[] | null
          read_time?: string | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      community_members: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          phone: string | null
          source: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
        }
        Relationships: []
      }
      listings: {
        Row: {
          amenities: string[] | null
          capacity: number | null
          comfort_living_info: string | null
          community_social_info: string | null
          country: string
          created_at: string
          created_by: string | null
          description: string | null
          discount_code_url: string | null
          discount_percentage: number | null
          discounted_price: number | null
          featured_image: string | null
          id: number
          images: string[] | null
          instagram_url: string | null
          is_seasonal: boolean | null
          location: string
          location_surroundings_info: string | null
          minimum_stay: number | null
          minimum_stay_unit: string | null
          original_price: number
          price_value_info: string | null
          pricing_unit: string | null
          rating: number | null
          review_count: number | null
          rooms: number | null
          seasonal_end_date: string | null
          seasonal_start_date: string | null
          status: Database["public"]["Enums"]["listing_status"]
          title: string
          type: Database["public"]["Enums"]["listing_type"]
          updated_at: string
          website_url: string | null
          work_wifi_info: string | null
        }
        Insert: {
          amenities?: string[] | null
          capacity?: number | null
          comfort_living_info?: string | null
          community_social_info?: string | null
          country: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_code_url?: string | null
          discount_percentage?: number | null
          discounted_price?: number | null
          featured_image?: string | null
          id?: number
          images?: string[] | null
          instagram_url?: string | null
          is_seasonal?: boolean | null
          location: string
          location_surroundings_info?: string | null
          minimum_stay?: number | null
          minimum_stay_unit?: string | null
          original_price: number
          price_value_info?: string | null
          pricing_unit?: string | null
          rating?: number | null
          review_count?: number | null
          rooms?: number | null
          seasonal_end_date?: string | null
          seasonal_start_date?: string | null
          status?: Database["public"]["Enums"]["listing_status"]
          title: string
          type?: Database["public"]["Enums"]["listing_type"]
          updated_at?: string
          website_url?: string | null
          work_wifi_info?: string | null
        }
        Update: {
          amenities?: string[] | null
          capacity?: number | null
          comfort_living_info?: string | null
          community_social_info?: string | null
          country?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_code_url?: string | null
          discount_percentage?: number | null
          discounted_price?: number | null
          featured_image?: string | null
          id?: number
          images?: string[] | null
          instagram_url?: string | null
          is_seasonal?: boolean | null
          location?: string
          location_surroundings_info?: string | null
          minimum_stay?: number | null
          minimum_stay_unit?: string | null
          original_price?: number
          price_value_info?: string | null
          pricing_unit?: string | null
          rating?: number | null
          review_count?: number | null
          rooms?: number | null
          seasonal_end_date?: string | null
          seasonal_start_date?: string | null
          status?: Database["public"]["Enums"]["listing_status"]
          title?: string
          type?: Database["public"]["Enums"]["listing_type"]
          updated_at?: string
          website_url?: string | null
          work_wifi_info?: string | null
        }
        Relationships: []
      }
      partner_inquiries: {
        Row: {
          coliving_name: string
          created_at: string
          email: string
          full_name: string
          id: string
          status: string | null
        }
        Insert: {
          coliving_name: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          status?: string | null
        }
        Update: {
          coliving_name?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          status?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comfort_living: Json | null
          created_at: string
          facilities_notes: string | null
          facilities_rating: number | null
          id: string
          listing_id: number
          location_surroundings: Json | null
          optimized_flag: boolean | null
          overall_rating: number | null
          price_notes: string | null
          price_rating: number | null
          price_value: Json | null
          review_text: string | null
          reviewer_name: string | null
          social_community: Json | null
          social_notes: string | null
          social_rating: number | null
          surroundings_notes: string | null
          surroundings_rating: number | null
          user_id: string
          work_notes: string | null
          work_rating: number | null
          work_wifi: Json | null
        }
        Insert: {
          comfort_living?: Json | null
          created_at?: string
          facilities_notes?: string | null
          facilities_rating?: number | null
          id?: string
          listing_id: number
          location_surroundings?: Json | null
          optimized_flag?: boolean | null
          overall_rating?: number | null
          price_notes?: string | null
          price_rating?: number | null
          price_value?: Json | null
          review_text?: string | null
          reviewer_name?: string | null
          social_community?: Json | null
          social_notes?: string | null
          social_rating?: number | null
          surroundings_notes?: string | null
          surroundings_rating?: number | null
          user_id: string
          work_notes?: string | null
          work_rating?: number | null
          work_wifi?: Json | null
        }
        Update: {
          comfort_living?: Json | null
          created_at?: string
          facilities_notes?: string | null
          facilities_rating?: number | null
          id?: string
          listing_id?: number
          location_surroundings?: Json | null
          optimized_flag?: boolean | null
          overall_rating?: number | null
          price_notes?: string | null
          price_rating?: number | null
          price_value?: Json | null
          review_text?: string | null
          reviewer_name?: string | null
          social_community?: Json | null
          social_notes?: string | null
          social_rating?: number | null
          surroundings_notes?: string | null
          surroundings_rating?: number | null
          user_id?: string
          work_notes?: string | null
          work_rating?: number | null
          work_wifi?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      listing_status: "active" | "inactive" | "pending"
      listing_type: "coliving" | "coworking" | "apartment" | "house"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      listing_status: ["active", "inactive", "pending"],
      listing_type: ["coliving", "coworking", "apartment", "house"],
    },
  },
} as const
