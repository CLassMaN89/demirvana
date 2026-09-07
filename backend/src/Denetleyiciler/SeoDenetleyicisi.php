<?php

declare(strict_types=1);

final class SeoDenetleyicisi
{
    public function __construct(private readonly SeoDeposu $depo)
    {
    }

    public function seo(): array
    {
        return $this->depo->seoVerileri();
    }
}
