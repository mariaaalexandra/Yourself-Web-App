export interface InventoryProduct
{
    id: string;
    category?: InventoryCategory;
    name: string;
    description?: string;
    tags?: InventoryTag[];
    brand?: InventoryBrand | null;
    vendor: InventoryVendor | null;
    stock: number;
    cost: number;
    price: number;
    thumbnail: string;
    images: string[];
    active: boolean;
}

export interface InventoryPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface InventoryCategory
{
    id: string;
    parentId: string;
    name: string;
    slug: string;
}

export interface InventoryBrand
{
    id: string;
    name: string;
    slug: string;
}

export interface InventoryTag
{
    id?: string;
    title?: string;
}

export interface InventoryVendor
{
    id: string;
    name: string;
    slug: string;
}
