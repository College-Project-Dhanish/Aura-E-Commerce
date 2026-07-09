import React from 'react';
import { SidebarGroup, SidebarItem } from './SidebarComponents';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart, 
  Users, 
  Tag, 
  Star, 
  Mail, 
  Settings 
} from 'lucide-react';

const Sidebar = ({ isOpen, setOpen }) => {
  return (
    <aside
      className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r border-neutral-200 bg-white transition-transform transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 dark:bg-neutral-900 dark:border-neutral-800 overflow-y-auto pb-10`}
    >
      <nav className="p-4 space-y-4">
        
        <SidebarGroup title="Dashboard" icon={LayoutDashboard}>
          <SidebarItem to="/admin/dashboard" label="Overview" />
        </SidebarGroup>

        <SidebarGroup title="Catalog" icon={ShoppingBag}>
          <SidebarItem to="/admin/catalog/categories" label="Categories" />
          <SidebarItem to="/admin/catalog/collections" label="Collections" />
          <SidebarItem to="/admin/catalog/products" label="Products" />
          <SidebarItem to="/admin/catalog/colors" label="Colors" />
          <SidebarItem to="/admin/catalog/sizes" label="Sizes" />
          <SidebarItem to="/admin/catalog/variants" label="Variants" />
          <SidebarItem to="/admin/catalog/images" label="Product Images" />
        </SidebarGroup>

        <SidebarGroup title="Orders" icon={ShoppingCart}>
          <SidebarItem to="/admin/orders" label="View Orders" />
        </SidebarGroup>

        <SidebarGroup title="Customers" icon={Users}>
          <SidebarItem to="/admin/customers" label="Customers List" />
        </SidebarGroup>

        <SidebarGroup title="Promotions" icon={Tag}>
          <SidebarItem to="/admin/promotions/coupons" label="Coupons" />
        </SidebarGroup>

        <SidebarGroup title="Reviews" icon={Star}>
          <SidebarItem to="/admin/reviews/pending" label="Pending Reviews" />
          <SidebarItem to="/admin/reviews/approved" label="Approved Reviews" />
        </SidebarGroup>

        <SidebarGroup title="Newsletter" icon={Mail}>
          <SidebarItem to="/admin/newsletter/subscribers" label="Subscribers" />
        </SidebarGroup>

        <SidebarGroup title="Settings" icon={Settings}>
          <SidebarItem to="/admin/settings/store" label="Store Settings" />
        </SidebarGroup>

      </nav>
    </aside>
  );
};

export default Sidebar;
