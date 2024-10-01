import { useState, useRef } from "react";
import { Modal } from "@/components/Modal"; 
import { Input } from "@/components/ui/input"; 
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';
import { z } from "zod"; 
import { Product } from '@/models/Product';

const productSchema = z.object({
  name: z.string().nonempty("Name cannot be empty"),
  price: z.number().min(0, "Price cannot be negative"),
  stock: z.number().min(0, "Stock cannot be less than 0"),
  description: z.string().nonempty("Description cannot be empty"),
  featuredImage: z.string().optional(),
});

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (updatedProduct: Partial<Product>) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onSave }) => {
  const t = useTranslations('Home');
  const [name, setName] = useState(product ? product.name : '');
  const [price, setPrice] = useState(product ? product.price.toString() : '');
  const [stock, setStock] = useState(product ? product.stock.toString() : '');
  const [description, setDescription] = useState(product ? product.description : '');
  const [featuredImage, setFeaturedImage] = useState(product ? product.featuredImage || '' : '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const nameRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const stockRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const parsedProduct = {
      name,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      description,
      featuredImage: featuredImage.trim() !== '' ? featuredImage : undefined,
    };

    const validation = productSchema.safeParse(parsedProduct);

    if (!validation.success) {
      const errorMessages = validation.error.format();
      setErrors({
        name: errorMessages.name?._errors[0] || '', 
        price: errorMessages.price?._errors[0] || '',  
        stock: errorMessages.stock?._errors[0] || '',  
        description: errorMessages.description?._errors[0] || ''  
      });

      if (errorMessages.name) {
        nameRef.current?.focus();
      } else if (errorMessages.price) {
        priceRef.current?.focus();
      } else if (errorMessages.stock) {
        stockRef.current?.focus();
      } else if (errorMessages.description) {
        descriptionRef.current?.focus();
      }
    } else {
      setErrors({});
      onSave(validation.data);
    }
  };

  return (
    <Modal onClose={onClose}>
      <Card>
        <CardHeader>
          <CardTitle>{product ? t('update') : t('create')}</CardTitle>
        </CardHeader>
        <div className="p-4 space-y-4">
          <div>
            <Input
              ref={nameRef} 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('name')}
            />
            {errors.name && <p className="text-red-500 mt-1">{errors.name}</p>} 
          </div>
          <div>
            <Input
              ref={priceRef} 
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              step="0.01"
              placeholder={t('price')}
            />
            {errors.price && <p className="text-red-500 mt-1">{errors.price}</p>}
          </div>
          <div>
            <Input
              ref={stockRef} 
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              type="number"
              placeholder={t('stock')}
            />
            {errors.stock && <p className="text-red-500 mt-1">{errors.stock}</p>} 
          </div>
          <div>
            <Input
              ref={descriptionRef} 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('description')}
            />
            {errors.description && <p className="text-red-500 mt-1">{errors.description}</p>} 
          </div>
          <Input
            value={featuredImage}
            onChange={(e) => setFeaturedImage(e.target.value)}
            placeholder={t('featuredImage')}
          />
        </div>
        <CardFooter>
          <Button onClick={handleSave}>{product ? t('update') : t('create')}</Button>
          <Button variant="ghost" onClick={onClose} className="ml-2">
            {t('cancel')}
          </Button>
        </CardFooter>
      </Card>
    </Modal>
  );
};

export default ProductModal;
