// types.ts
export interface User {
    id: string;
    email?: string;
    family_group_id?: string;
  }
  
  export interface Game {
    id: string;
    title: string;
    description: string | null;
    price: number;
    owner_id: string;
    genre: string[];
  }
  
  export interface FamilyGroup {
    id: string;
    owner_id: string;
    name: string;
  }
  
  export interface FamilyMember {
    user_id: string;
    family_group_id: string;
    role: 'owner' | 'member';
    created_at: string;
    users: {
      id:  string;
      email: string;
    };
  }
  
  export interface GamePurchase {
    id: string;
    game_id: string;
    owner_id: string;
    purchased_at: Date;
  }