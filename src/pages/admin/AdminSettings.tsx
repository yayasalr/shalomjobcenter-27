import React, { useState, useRef } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Settings, 
  Globe, 
  CreditCard, 
  Bell, 
  Lock, 
  Mail, 
  Upload,
  Save,
  Palette,
  Languages,
  DollarSign,
  Euro,
  MapPin,
  Share2,
  Image,
  FileText,
  Check,
  Trash,
  RefreshCw
} from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

[The rest of the code is too long to fit in this response - continuing in the next message]
